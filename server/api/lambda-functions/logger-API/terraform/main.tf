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
  handler          = "index.handler"
  s3_bucket = "${data.aws_s3_bucket.existing_bucket.id}"
  s3_key      = "${aws_s3_object.file_upload.key}"
  role             = aws_iam_role.lambda_role.arn
  source_code_hash = data.archive_file.source.output_base64sha256
  depends_on = [aws_s3_object.file_upload]
}

# Create an IAM role for the Lambda function
resource "aws_iam_role" "lambda_role" {
  name = "LambdaRole"

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

# Attach an IAM policy to the Lambda role granting S3 permissions
resource "aws_iam_role_policy_attachment" "lambda_s3_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"  # Adjust the policy ARN as needed
}

# Create the API Gateway HTTP API
resource "aws_apigatewayv2_api" "s3_proxy_api" {
  name          = "S3ProxyAPI"
  protocol_type = "HTTP"
}

# Create a route for the S3 proxy path
resource "aws_apigatewayv2_route" "s3_proxy_route" {
  api_id    = aws_apigatewayv2_api.s3_proxy_api.id
  route_key = "PUT /logs"  # Replace with your desired route path

  target = "integrations/${aws_apigatewayv2_integration.s3_proxy_integration.id}"
}

# Create an integration with the Lambda function
resource "aws_apigatewayv2_integration" "s3_proxy_integration" {
  api_id = aws_apigatewayv2_api.s3_proxy_api.id

  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.log_writer_lambda.invoke_arn
}


