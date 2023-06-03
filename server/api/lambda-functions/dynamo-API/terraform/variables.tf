# Input variable definitions

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "bucket_name" {
  type    = string
  default = "recipe-app-code"
}

variable "dynamodb_table" {
  type = string
  default = "RecipeTable"
  
}

variable "lambda_name" {
  default = "recipe-api"
  
}

variable "lambda_log_retention" {
  description = "lambda log retention in days"
  type = number
  default = 7
}

variable "apigw_log_retention" {
  description = "api gwy log retention in days"
  type = number
  default = 7
}