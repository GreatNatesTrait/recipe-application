resource "aws_api_gateway_api_key" "MyDemoApiKey" {
  name = "webhook"
}

resource "aws_iam_role" "s3_proxy_role" {
  name               = "${var.environment}-s3-proxy-role-example"
  path               = "/"
  assume_role_policy = "${data.aws_iam_policy_document.s3_proxy_policy.json}"
   tags = merge({
    "Name" = "webhook-apigateway",
    }
  )
}

data "aws_iam_policy_document" "s3_proxy_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "ping_data_allow_access" {
  name = "webhook-apigateway"
  role = aws_iam_role.s3_proxy_role.id
  policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Sid" : "VisualEditor0",
          "Effect" : "Allow",
          "Action" : [
            "s3:ListStorageLensConfigurations",
            "s3:ListAccessPointsForObjectLambda",
            "s3:GetAccessPoint",
            "s3:PutAccountPublicAccessBlock",
            "s3:GetAccountPublicAccessBlock",
            "s3:ListAllMyBuckets",
            "s3:ListAccessPoints",
            "s3:PutAccessPointPublicAccessBlock",
            "s3:ListJobs",
            "s3:PutStorageLensConfiguration",
            "s3:ListMultiRegionAccessPoints",
            "s3:CreateJob"
          ],
          "Resource" : "*"
        },
        {
          "Sid" : "VisualEditor1",
          "Effect" : "Allow",
          "Action" : "s3:*",
          "Resource" : [
            "arn:aws:s3:::nwebhook-apigateway*",
            "arn:aws:s3:::nwebhook-apigateway/*"
          ]
        }
      ]
    }
  )
}

resource "aws_iam_role_policy_attachment" "s3_proxy_role_file_upload_attachment" {
  depends_on = [
    "aws_iam_policy.s3_file_upload_policy",
  ]

  role       = "${aws_iam_role.s3_proxy_role.name}"
  policy_arn = "${aws_iam_policy.s3_file_upload_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "s3_proxy_role_api_gateway_attachment" {
  depends_on = [
    "aws_iam_policy.s3_file_upload_policy",
  ]

  role       = "${aws_iam_role.s3_proxy_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonAPIGatewayInvokeFullAccess"
}

resource "aws_s3_bucket" "file_upload_bucket" {
  bucket = "natefile-upload-bucket-${var.environment}"
  acl    = "private"

 tags = merge({
   Name        = "file-upload-bucket-${var.environment}",
    Environment = "${var.environment}"
    }
  )
  depends_on = [
    "aws_iam_policy.s3_file_upload_policy",
  ]
}

resource "aws_iam_policy" "s3_file_upload_policy" {
  name        = "${var.environment}-github-s3-file-upload-policy"
  path        = "/"
  description = "${var.environment} s3 file upload policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
                "s3:PutObject",
                "s3:GetObject"
            ],
      "Effect": "Allow",
      "Resource": [
                "arn:aws:s3:::file-upload-bucket-${var.environment}/*" 
            ]
    }
  ]
}
EOF
}

# S3 bucket to store the required software
resource "aws_s3_bucket" "ping-data" {
  bucket = "nwebhook-apigateway"
  tags = merge({
    "Name" = "nwebhook-apigateway",
    }
  )
}

resource "aws_s3_bucket_public_access_block" "ping-data" {
  bucket                  = "nwebhook-apigateway"
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}



resource "aws_api_gateway_rest_api" "api" {
  name        = "api-gateway-webhook"
  description = "enable webhook for S3 bucket"
  endpoint_configuration {
  types = ["REGIONAL"]
}
}


resource "aws_api_gateway_resource" "bucketResource" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id   = "${aws_api_gateway_rest_api.api.root_resource_id}"
  path_part   = "{bucket}"
}

resource "aws_api_gateway_resource" "folderResource" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id   = "${aws_api_gateway_resource.bucketResource.id}"
  path_part   = "{folder}"
}

resource "aws_api_gateway_resource" "itemResource" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id   = "${aws_api_gateway_resource.folderResource.id}"
  path_part   = "{item}"
}


resource "aws_api_gateway_method" "itemPutMethod" {
  rest_api_id      = "${aws_api_gateway_rest_api.api.id}"
  resource_id      = "${aws_api_gateway_resource.itemResource.id}"
  http_method      = "PUT"
  authorization    = "NONE"
  api_key_required = true

  request_parameters = {
    "method.request.header.Accept"              = false
    "method.request.header.Content-Type"        = false
    "method.request.header.x-amz-meta-fileinfo"        = false

    "method.request.path.bucket" = true
    "method.request.path.folder" = true
    "method.request.path.item"   = true
  }
}

resource "aws_api_gateway_method" "itemOptionsMethod" {
  rest_api_id   = "${aws_api_gateway_rest_api.api.id}"
  resource_id   = "${aws_api_gateway_resource.itemResource.id}"
  http_method   = "OPTIONS"
  authorization = "NONE"

  request_parameters = {
    "method.request.header.x-amz-meta-fileinfo" = false
  }
}

resource "aws_api_gateway_method" "itemGetMethod" {
  rest_api_id      = "${aws_api_gateway_rest_api.api.id}"
  resource_id      = "${aws_api_gateway_resource.itemResource.id}"
  http_method      = "GET"
  authorization    = "NONE"
  api_key_required = true

  request_parameters = {
    "method.request.path.bucket" = true
    "method.request.path.folder" = true
    "method.request.path.item"   = true
  }
}


resource "aws_api_gateway_integration" "itemPutMethod-ApiProxyIntegration" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.itemResource.id}"
  http_method = "${aws_api_gateway_method.itemPutMethod.http_method}"

  type                    = "AWS"
  integration_http_method = "PUT"
  passthrough_behavior    = "WHEN_NO_TEMPLATES"
  content_handling        = "CONVERT_TO_TEXT"
  credentials             = "${aws_iam_role.s3_proxy_role.arn}"
  uri                     = "arn:aws:apigateway:us-east-1:s3:path/{bucket}/{folder}/{item}"

  request_parameters ={
    "integration.request.header.x-amz-meta-fileinfo" = "method.request.header.x-amz-meta-fileinfo"
    "integration.request.header.Accept"              = "method.request.header.Accept"
    "integration.request.header.Content-Type"        = "method.request.header.Content-Type"

    "integration.request.path.item"   = "method.request.path.item"
    "integration.request.path.folder" = "method.request.path.folder"
    "integration.request.path.bucket" = "method.request.path.bucket"
  }
}

resource "aws_api_gateway_integration" "itemGetMethod-ApiProxyIntegration" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.itemResource.id}"
  http_method = "${aws_api_gateway_method.itemGetMethod.http_method}"

  type                    = "AWS"
  integration_http_method = "GET"
  credentials             = "${aws_iam_role.s3_proxy_role.arn}"
  uri                     = "arn:aws:apigateway:us-east-1:s3:path/{bucket}/{folder}/{item}"

  request_parameters ={
    "integration.request.path.item"   = "method.request.path.item"
    "integration.request.path.folder" = "method.request.path.folder"
    "integration.request.path.bucket" = "method.request.path.bucket"
  }
}

resource "aws_api_gateway_integration" "itemOptionsMethod-ApiProxyIntegration" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.itemResource.id}"
  http_method = "${aws_api_gateway_method.itemOptionsMethod.http_method}"
  type        = "MOCK"
  depends_on  = ["aws_api_gateway_method.itemOptionsMethod"]
}

resource "aws_api_gateway_method_response" "itemPutMethod200Response" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.itemResource.id}"
  http_method = "${aws_api_gateway_method.itemPutMethod.http_method}"
  status_code = "200"

  response_models ={
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }

  depends_on = ["aws_api_gateway_method.itemPutMethod"]
}

resource "aws_api_gateway_method_response" "itemOptionsMethod200Response" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.itemResource.id}"
  http_method = "${aws_api_gateway_method.itemOptionsMethod.http_method}"
  status_code = "200"

  response_models ={
    "application/json" = "Empty"
  }

  response_parameters= {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  depends_on = ["aws_api_gateway_method.itemOptionsMethod"]
}

resource "aws_api_gateway_method_response" "itemGetMethod200Response" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.itemResource.id}"
  http_method = "${aws_api_gateway_method.itemGetMethod.http_method}"
  status_code = "200"

  response_models ={
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }

  depends_on = ["aws_api_gateway_method.itemGetMethod"]
}

resource "aws_api_gateway_integration_response" "itemPutMethod-IntegrationResponse" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.itemResource.id}"
  http_method = "${aws_api_gateway_method.itemPutMethod.http_method}"

  status_code = "${aws_api_gateway_method_response.itemPutMethod200Response.status_code}"

  response_templates ={
    "application/json" = ""
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
}

resource "aws_api_gateway_integration_response" "itemGetMethod-IntegrationResponse" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.itemResource.id}"
  http_method = "${aws_api_gateway_method.itemGetMethod.http_method}"

  status_code = "${aws_api_gateway_method_response.itemGetMethod200Response.status_code}"
 response_templates ={
    "application/json" = ""
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

}

resource "aws_api_gateway_integration_response" "itemOptionsMethod-IntegrationResponse" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.itemResource.id}"
  http_method = "${aws_api_gateway_method.itemOptionsMethod.http_method}"
  status_code = "${aws_api_gateway_method_response.itemOptionsMethod200Response.status_code}"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,x-amz-meta-fileinfo'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,PUT,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  response_templates ={
    "application/json" = ""
  }

  depends_on = ["aws_api_gateway_method_response.itemOptionsMethod200Response", "aws_api_gateway_integration.itemOptionsMethod-ApiProxyIntegration"]
}


resource "aws_api_gateway_deployment" "S3APIDeployment" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  depends_on = [
    "aws_api_gateway_integration.itemPutMethod-ApiProxyIntegration",
    "aws_api_gateway_integration.itemGetMethod-ApiProxyIntegration",
    "aws_api_gateway_integration.itemOptionsMethod-ApiProxyIntegration",
  ]
 
}

resource "aws_api_gateway_stage" "S3API" {
  deployment_id = aws_api_gateway_deployment.S3APIDeployment.id
  cache_cluster_size = "0.5"
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = "s3api"
}

resource "aws_api_gateway_usage_plan" "example" {
  name         = "usage-plan"
  description  = "webhook-apigateway"

  api_stages {
    api_id = aws_api_gateway_rest_api.api.id
    stage  = aws_api_gateway_stage.S3API.stage_name
  }

  quota_settings {
    limit  = 200
    offset = 2
    period = "WEEK"
  }

  throttle_settings {
    burst_limit = 5
    rate_limit  = 10
  }
}

resource "aws_api_gateway_usage_plan_key" "main" {
  key_id        = aws_api_gateway_api_key.MyDemoApiKey.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.example.id
}