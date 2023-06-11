output "dynamo_api_url" {
  description = "URL for API Gateway stage"
  value = "export const dynamo_api_url = ${aws_apigatewayv2_stage.default.invoke_url}"
}