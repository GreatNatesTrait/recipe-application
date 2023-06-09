terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "4.59.0"
    }
  }

  backend "s3" {
    bucket         	   = "recipe-app-code"
    key              	   = "state/dynamo-api/terraform.tfstate"
    region         	   = "us-east-1"
    encrypt        	   = true
  }
}

provider "aws" {
  region = "us-east-1"
}

data "aws_s3_bucket" "existing_bucket" {
  bucket = "recipe-app-code"
}

data "archive_file" "source" {
  type        = "zip"
  source_dir  = "${path.cwd}/../code"
  output_path = "${path.cwd}/lambda.zip"
}

resource "aws_s3_object" "file_upload" {
  bucket = "${data.aws_s3_bucket.existing_bucket.id}"
  key    = "lambda-functions/dynamo-api.zip"
  source = "${data.archive_file.source.output_path}"
  etag = filemd5(data.archive_file.source.output_path)
}


resource "aws_lambda_function" "dynamo_lambda" {
  function_name    = "dynamo-lambda"
  runtime          = "nodejs18.x"
  handler          = "main.lambda_handler"
  s3_bucket = "${data.aws_s3_bucket.existing_bucket.id}"
  s3_key      = "${aws_s3_object.file_upload.key}"
  role = aws_iam_role.lambda_role.arn
  source_code_hash = data.archive_file.source.output_base64sha256
  depends_on = [aws_cloudwatch_log_group.dynamo-lambda, aws_s3_object.file_upload]
}

resource "aws_cloudwatch_log_group" "dynamo-lambda" {
  name = "/aws/lambda/dynamo-lambda"
}


resource "aws_iam_role" "lambda_role" {
  name = "dynamo-lambda-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  policy_arn = aws_iam_policy.lambda_policy.arn
  role = aws_iam_role.lambda_role.name
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "dynamo-lambda-policy"
  description = "Allows Lambda function to write dynamodb recipe table"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowDynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchWriteItem",
        "dynamodb:BatchGetItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:372554721158:table/*"
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
EOF
}

resource "aws_apigatewayv2_api" "dynamo_api" {
  name        = "dynamo-api"
  protocol_type = "HTTP"
  cors_configuration  {
    allow_credentials = false
    allow_headers     = ["*"]
    allow_methods     = ["*"]
    allow_origins     = ["*"]
    expose_headers    = ["*"]
    max_age           = 0
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.dynamo_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "recipe_app" {
  api_id = aws_apigatewayv2_api.dynamo_api.id
  integration_uri    = aws_lambda_function.dynamo_lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "Get_All" {
  api_id = aws_apigatewayv2_api.dynamo_api.id
  route_key = "GET /recipes"
  target    = "integrations/${aws_apigatewayv2_integration.recipe_app.id}"
}

resource "aws_apigatewayv2_route" "Get_Recipe_By_ID" {
  api_id = aws_apigatewayv2_api.dynamo_api.id
  route_key = "GET /recipe"
  target    = "integrations/${aws_apigatewayv2_integration.recipe_app.id}"
}

resource "aws_apigatewayv2_route" "Delete_Recipe_By_ID" {
  api_id = aws_apigatewayv2_api.dynamo_api.id
  route_key = "DELETE /recipe"
  target    = "integrations/${aws_apigatewayv2_integration.recipe_app.id}"
}

resource "aws_apigatewayv2_route" "Get_Recipe_By_Category" {
  api_id = aws_apigatewayv2_api.dynamo_api.id
  route_key = "GET /recipesByCategory"
  target    = "integrations/${aws_apigatewayv2_integration.recipe_app.id}"
}

resource "aws_apigatewayv2_route" "Get_Recipe_Search" {
  api_id = aws_apigatewayv2_api.dynamo_api.id
  route_key = "GET /recipes/search"
  target    = "integrations/${aws_apigatewayv2_integration.recipe_app.id}"
}

resource "aws_apigatewayv2_route" "Create_Recipe" {
  api_id = aws_apigatewayv2_api.dynamo_api.id
  route_key = "PUT /create-recipe"
  target    = "integrations/${aws_apigatewayv2_integration.recipe_app.id}"
}

resource "aws_apigatewayv2_route" "Existing_Primary_Keys" {
  api_id = aws_apigatewayv2_api.dynamo_api.id
  route_key = "GET /existing-primary-keys"
  target    = "integrations/${aws_apigatewayv2_integration.recipe_app.id}"
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.dynamo_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.dynamo_api.execution_arn}/*/*"
}


