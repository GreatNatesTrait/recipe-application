# Configure the AWS provider
provider "aws" {
  region = "us-east-1"  # Replace with your desired AWS region
}

# Create an AWS Lambda function
resource "aws_lambda_function" "log_writer_lambda" {
  function_name    = "LogWriterLambda"
  runtime          = "nodejs18.x"
  handler          = "index.handler"
  timeout          = 10
  memory_size      = 128
  role             = aws_iam_role.lambda_role.arn
  source_code_hash = filebase64sha256("${path.module}/lambda_function.zip")
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


