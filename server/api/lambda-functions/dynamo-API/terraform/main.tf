provider "aws" {
  region = "us-east-1"  # Replace with your desired region
}

resource "aws_cognito_user_pool" "example_user_pool" {
  name = "example-user-pool-two"
  
  # Add any additional configurations as needed
  alias_attributes = ["preferred_username"]
  
  schema {
    attribute_data_type = "String"
    name                = "preferred_username"
    required            = false
    mutable             = true
  }
  
  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
  }
}


