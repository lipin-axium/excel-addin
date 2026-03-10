# ─── Rate Limit Table ────────────────────────────────────────────────────────

resource "aws_dynamodb_table" "rate_limits" {
  name         = "${var.project_name}-rate-limits"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"

  attribute {
    name = "pk"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}

# ─── Bedrock Lambda IAM ──────────────────────────────────────────────────────

resource "aws_iam_role" "bedrock_lambda" {
  name = "${var.project_name}-bedrock-lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "bedrock_lambda_basic" {
  role       = aws_iam_role.bedrock_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "bedrock_lambda_policy" {
  role = aws_iam_role.bedrock_lambda.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModelWithResponseStream",
          "bedrock:InvokeModel",
        ]
        # Covers foundation models and global inference profiles
        Resource = [
          "arn:aws:bedrock:*::foundation-model/anthropic.claude-*",
          "arn:aws:bedrock:*:*:inference-profile/global.anthropic.claude-*",
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
        ]
        Resource = aws_dynamodb_table.rate_limits.arn
      },
    ]
  })
}


# ─── Bedrock Proxy Lambda ────────────────────────────────────────────────────

data "archive_file" "bedrock_proxy" {
  type        = "zip"
  source_dir  = "${path.module}/lambda-bedrock"
  output_path = "${path.module}/lambda-bedrock.zip"
}

resource "aws_lambda_function" "bedrock_proxy" {
  function_name    = "${var.project_name}-bedrock-proxy"
  runtime          = "nodejs22.x"
  handler          = "index.handler"
  role             = aws_iam_role.bedrock_lambda.arn
  filename         = data.archive_file.bedrock_proxy.output_path
  source_code_hash = data.archive_file.bedrock_proxy.output_base64sha256
  timeout          = 300
  memory_size      = 512

  environment {
    variables = {
      RATE_LIMIT_TABLE   = aws_dynamodb_table.rate_limits.name
      DAILY_LIMIT        = "0"
      BEDROCK_MODEL_ID   = "global.anthropic.claude-sonnet-4-6"
      BEDROCK_REGION     = "ap-southeast-1"
      ORIGIN_SECRET      = "9c47998224477e27be7632c4f7706aae24b29452d16fa6b3501e517f5404ae37"
    }
  }
}

# ─── Lambda Function URL (streaming) ─────────────────────────────────────────
# Uses AWS_IAM auth — only CloudFront OAC can invoke it (SCP-safe).

resource "aws_lambda_function_url" "bedrock_proxy" {
  function_name      = aws_lambda_function.bedrock_proxy.function_name
  # JWT + Custom Header auth is validated inside the Lambda handler
  authorization_type = "NONE"
  invoke_mode        = "RESPONSE_STREAM"
}

# Allow public access to the Function URL (Auth = NONE)
resource "aws_lambda_permission" "public_invoke_url" {
  statement_id           = "FunctionURLAllowPublicAccess"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.bedrock_proxy.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}

resource "aws_lambda_permission" "public_invoke_function" {
  statement_id             = "FunctionURLAllowPublicInvokeFunction"
  action                   = "lambda:InvokeFunction"
  function_name            = aws_lambda_function.bedrock_proxy.function_name
  principal                = "*"
  invoked_via_function_url = true
}



# ─── CloudFront CORS response headers policy ─────────────────────────────────

resource "aws_cloudfront_response_headers_policy" "bedrock_cors" {
  name = "${var.project_name}-bedrock-cors"

  cors_config {
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = ["x-api-key", "content-type", "anthropic-version", "anthropic-beta"]
    }
    access_control_allow_methods {
      items = ["POST", "OPTIONS"]
    }
    access_control_allow_origins {
      items = ["*"]
    }
    access_control_max_age_sec = 86400
    origin_override            = true
  }
}

# ─── CloudFront origin request policy ────────────────────────────────────────
# Forwards the browser's custom headers to the Lambda origin.

resource "aws_cloudfront_origin_request_policy" "bedrock_proxy" {
  name = "${var.project_name}-bedrock-origin"

  headers_config {
    header_behavior = "whitelist"
    headers {
      items = [
        "x-api-key",
        "content-type",
        "anthropic-version",
        "anthropic-beta",
      ]
    }
  }

  query_strings_config {
    query_string_behavior = "none"
  }

  cookies_config {
    cookie_behavior = "none"
  }
}

# ─── CloudFront distribution ──────────────────────────────────────────────────

resource "aws_cloudfront_distribution" "bedrock_proxy" {
  enabled         = true
  is_ipv6_enabled = true
  comment         = "${var.project_name} Bedrock proxy"
  price_class     = "PriceClass_200" # US, Europe, Asia Pacific

  origin {
    origin_id                = "bedrock-lambda"
    domain_name              = trimsuffix(trimprefix(aws_lambda_function_url.bedrock_proxy.function_url, "https://"), "/")

    custom_header {
      name  = "x-origin-verify"
      value = "9c47998224477e27be7632c4f7706aae24b29452d16fa6b3501e517f5404ae37"
    }

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "https-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_read_timeout      = 60
      origin_keepalive_timeout = 60
    }
  }

  default_cache_behavior {
    target_origin_id       = "bedrock-lambda"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods  = ["GET", "HEAD"]

    compress = false

    cache_policy_id            = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.bedrock_proxy.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.bedrock_cors.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# ─── Outputs ──────────────────────────────────────────────────────────────────

output "bedrock_proxy_url" {
  value       = "https://${aws_cloudfront_distribution.bedrock_proxy.domain_name}/"
  description = "Bedrock proxy CloudFront URL — set as VITE_BEDROCK_PROXY_URL in GitHub Actions secrets and .env.local"
}

output "bedrock_lambda_url" {
  value       = aws_lambda_function_url.bedrock_proxy.function_url
  description = "Direct Lambda URL (blocked without CloudFront secret header — do not use directly)"
  sensitive   = true
}
