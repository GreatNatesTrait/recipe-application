provider "aws" {
  profile = "default"
  region = "us-east-1"
}

resource "random_string" "random" {
  length           = 3
  special          = false
}

resource "null_resource" "output_to_js" {
  provisioner "local-exec" {
    command = <<-EOT
      echo $text @"
        export const dynamo_api_url = '${aws_apigatewayv2_stage.default.invoke_url}';
      "@ | Out-File -FilePath "../../../../env_vars.ts" -Encoding UTF8
    EOT
    interpreter = ["PowerShell", "-Command"]
  }
}


#========================================================================
// lambda setup
#========================================================================

data "archive_file" "lambda_zip" {
  type = "zip"
  source_dir  = "${path.cwd}/../code"
  //source_file = "${path.cwd}/../main.js"
  output_path = "${path.cwd}/dynamoAPI.zip"
}

resource "aws_s3_object" "dynamoAPI_code" {
  bucket = var.bucket_name
  key    = "dynamoAPI.zip"
  source = data.archive_file.lambda_zip.output_path
  etag = filemd5(data.archive_file.lambda_zip.output_path)
}

//Define lambda function
resource "aws_lambda_function" "dynamo_api" {
  function_name = "${var.lambda_name}-${random_string.random.id}"
  s3_bucket = var.bucket_name
  s3_key    = aws_s3_object.dynamoAPI_code.key
  runtime = "nodejs18.x"
  handler = "main.lambda_handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  role = aws_iam_role.lambda_ddb_exec.arn 
  environment {
    variables = {
      DDB_TABLE = var.dynamodb_table
    }
  }
  depends_on = [aws_cloudwatch_log_group.lambda_logs] 
}

resource "aws_cloudwatch_log_group" "lambda_logs" {
  name = "/aws/lambda/${var.lambda_name}"
  retention_in_days = var.lambda_log_retention
}

resource "aws_iam_role" "lambda_ddb_exec" {
  name = "Lambda-Dynamo-Role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }]
  })
}

resource "aws_iam_policy" "lambda_ddb_exec_role" {
  name = "Lambda-Dynamo-Policy"
  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:Scan"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/${var.dynamodb_table}"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "lambda_ddb_policy" {
  role       = aws_iam_role.lambda_ddb_exec.name
  policy_arn = aws_iam_policy.lambda_ddb_exec_role.arn
}


#========================================================================
// API gateway setup
#========================================================================

resource "aws_apigatewayv2_api" "lambda" {
  name          = "recipe_API"
  protocol_type = "HTTP"
}


resource "aws_apigatewayv2_stage" "default" {
  api_id = aws_apigatewayv2_api.lambda.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "app" {
  api_id = aws_apigatewayv2_api.lambda.id
  integration_uri    = aws_lambda_function.dynamo_api.invoke_arn
  integration_type   = "AWS_PROXY"
  payload_format_version = "2.0"
}


resource "aws_apigatewayv2_route" "Get_Recipes" {
  api_id = aws_apigatewayv2_api.lambda.id
  route_key = "GET /recipes"
  target    = "integrations/${aws_apigatewayv2_integration.app.id}"
}


resource "aws_lambda_permission" "lambda_ddb" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.dynamo_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}
