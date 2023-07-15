output "api-url" {
  description = "URL for API Gateway stage"
  value = aws_api_gateway_rest_api.api
}

output "api-key" {
      description = "api key"
  value = aws_api_gateway_usage_plan_key.main
}

