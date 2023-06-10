

provider "aws" {
  region = "us-east-1"  # Update with your desired AWS region
}

resource "aws_lambda_function" "hello_lambda" {
  function_name = "hello_lambda"
  runtime       = "nodejs14.x"
  handler       = "index.handler"
  timeout       = 10

  # Contents of the Lambda function code
  # You can put your own implementation here
  # For simplicity, we'll use an inline function that returns "Hello, World!"
  # Make sure to replace the function code with your own implementation if needed
  inline_code = <<-EOT
    exports.handler = async (event) => {
      return {
        statusCode: 200,
        body: "Hello, World!"
      };
    };
  EOT
}

resource "aws_api_gateway_rest_api" "hello_api" {
  name        = "hello_api"
  description = "API Gateway for Hello, World!"
}

resource "aws_api_gateway_resource" "hello_resource" {
  rest_api_id = aws_api_gateway_rest_api.hello_api.id
  parent_id   = aws_api_gateway_rest_api.hello_api.root_resource_id
  path_part   = "hello"
}

resource "aws_api_gateway_method" "hello_method" {
  rest_api_id   = aws_api_gateway_rest_api.hello_api.id
  resource_id   = aws_api_gateway_resource.hello_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "hello_integration" {
  rest_api_id             = aws_api_gateway_rest_api.hello_api.id
  resource_id             = aws_api_gateway_resource.hello_resource.id
  http_method             = aws_api_gateway_method.hello_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.hello_lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "hello_deployment" {
  depends_on    = [aws_api_gateway_integration.hello_integration]
  rest_api_id   = aws_api_gateway_rest_api.hello_api.id
  stage_name    = "prod"
  variables = {
    lambdaAlias = aws_lambda_function.hello_lambda.function_name
  }
}
