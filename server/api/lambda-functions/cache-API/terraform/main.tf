terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "4.59.0"
    }
  }

  backend "s3" {
    bucket         	   = "recipe-app-code"
    key              	   = "state/cache-api/terraform.tfstate"
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
  key    = "lambda-functions/cache-api.zip"
  source = "${data.archive_file.source.output_path}"
  etag = filemd5(data.archive_file.source.output_path)
}


resource "aws_lambda_function" "dynamo_lambda" {
  function_name    = "dynamo-cache"
  runtime          = "nodejs18.x"
  handler          = "main.lambda_handler"
  s3_bucket = "${data.aws_s3_bucket.existing_bucket.id}"
  s3_key      = "${aws_s3_object.file_upload.key}"
  role = aws_iam_role.recipe_cache_role.arn
  source_code_hash = data.archive_file.source.output_base64sha256
  depends_on = [aws_cloudwatch_log_group.recipe-cache, aws_s3_object.file_upload]
}

resource "aws_lambda_event_source_mapping" "example" {
  event_source_arn  = "arn:aws:dynamodb:us-east-1:372554721158:table/RecipeTable"
  function_name     = aws_lambda_function.dynamo_lambda.function_name
  starting_position = "LATEST"
}

resource "aws_cloudwatch_log_group" "recipe-cache" {
  name = "/aws/lambda/cache-api"
}


resource "aws_iam_role" "recipe_cache_role" {
  name = "dynamo-cache-role"
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
  role = aws_iam_role.recipe_cache_role.name
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "dynamo-cache-policy"
  description = "Allows Lambda function to write dynamodb recipe table"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowDynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchGetItem",
         "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:DescribeStream",
                "dynamodb:ListStreams"
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

resource "aws_apigatewayv2_api" "cache_api" {
  name        = "cache-api"
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
  api_id      = aws_apigatewayv2_api.cache_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "recipe_app" {
  api_id = aws_apigatewayv2_api.cache_api.id
  integration_uri    = aws_lambda_function.dynamo_lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "Get_All" {
  api_id = aws_apigatewayv2_api.cache_api.id
  route_key = "GET /cache-state"
  target    = "integrations/${aws_apigatewayv2_integration.recipe_app.id}"
}


resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.dynamo_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.cache_api.execution_arn}/*/*"
}


