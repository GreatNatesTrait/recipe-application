# Output the API Gateway endpoint URL
output "api_endpoint" {
  value = aws_apigatewayv2_api.s3_proxy_api.api_endpoint
}