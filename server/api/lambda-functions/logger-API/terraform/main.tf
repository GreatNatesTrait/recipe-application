# Configure the AWS provider
provider "aws" {
  region = "us-east-1"  # Replace with your desired AWS region
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
  key    = "lambda-functions/logger-api.zip"
  source = "${data.archive_file.source.output_path}"
  etag = filemd5(data.archive_file.source.output_path)
}


# Create an AWS Lambda function
resource "aws_lambda_function" "log_writer_lambda" {
  function_name    = "LogWriterLambda"
  runtime          = "nodejs18.x"
  handler          = "main.lambda_handler"
  s3_bucket = "${data.aws_s3_bucket.existing_bucket.id}"
  s3_key      = "${aws_s3_object.file_upload.key}"
  role             = aws_iam_role.lambda_log_writing_role.arn
  source_code_hash = data.archive_file.source.output_base64sha256
  depends_on = [aws_cloudwatch_log_group.log_writing_lambda, aws_s3_object.file_upload]
}

resource "aws_cloudwatch_log_group" "log_writing_lambda" {
  name = "/aws/lambda/log-writing-lambda"
}


resource "aws_iam_role" "lambda_log_writing_role" {
  name = "s3-logger-role"
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

resource "aws_iam_role_policy_attachment" "lambda_log_writing_policy_attachment" {
  policy_arn = aws_iam_policy.lambda_log_writing_policy.arn
  role = aws_iam_role.lambda_log_writing_role.name
}

resource "aws_iam_policy" "lambda_log_writing_policy" {
  name        = "log-writing-lambda-policy"
  description = "Allows Lambda function to write logs to s3"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": ["arn:aws:s3:::recipe-app-code","arn:aws:s3:::recipe-app-code/logs/*"]
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


# Create the API Gateway HTTP API
resource "aws_apigatewayv2_api" "s3_proxy_api" {
  name          = "S3ProxyAPI"
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

# Create a route for the S3 proxy path
resource "aws_apigatewayv2_route" "s3_proxy_route" {
  api_id    = aws_apigatewayv2_api.s3_proxy_api.id
  route_key = "PUT /logs"  # Replace with your desired route path

  target = "integrations/${aws_apigatewayv2_integration.s3_proxy_integration.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.s3_proxy_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "s3_proxy_integration" {
  api_id = aws_apigatewayv2_api.s3_proxy_api.id
  integration_uri    = aws_lambda_function.log_writer_lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  payload_format_version = "2.0"
}


resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.log_writer_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.s3_proxy_api.execution_arn}/*/*"
}

