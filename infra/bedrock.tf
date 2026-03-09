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
      RATE_LIMIT_TABLE = aws_dynamodb_table.rate_limits.name
      # Set to 0 to disable rate limiting (testing mode).
      # Set to a positive integer (e.g. "100") to enforce a daily per-user limit.
      DAILY_LIMIT      = "0"
      # Cross-region inference profile for ap-southeast-1.
      # Verify the exact model ID in the Bedrock console under Model access.
      BEDROCK_MODEL_ID = "global.anthropic.claude-sonnet-4-6"
      BEDROCK_REGION   = "ap-southeast-1"
    }
  }
}

# ─── Lambda Function URL (streaming) ─────────────────────────────────────────

resource "aws_lambda_function_url" "bedrock_proxy" {
  function_name  = aws_lambda_function.bedrock_proxy.function_name
  # JWT auth is validated inside the Lambda handler
  authorization_type = "NONE"
  # RESPONSE_STREAM is required for SSE streaming — API Gateway would buffer the response
  invoke_mode    = "RESPONSE_STREAM"

  cors {
    allow_credentials = false
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers = [
      "content-type",
      "x-api-key",
      "anthropic-version",
      "anthropic-beta",
    ]
    max_age = 86400
  }
}

# ─── Output ───────────────────────────────────────────────────────────────────

output "bedrock_proxy_url" {
  value       = aws_lambda_function_url.bedrock_proxy.function_url
  description = "Bedrock proxy Function URL — set as VITE_BEDROCK_PROXY_URL in GitHub Actions secrets. No npm install needed: @aws-sdk is built into the Lambda Node.js 22 runtime."
}
