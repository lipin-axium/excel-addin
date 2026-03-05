locals {
  bucket_name         = "${var.project_name}-static"
  bucket_name_managed = "${var.project_name}-static-managed"
}

# S3 bucket — private, no public access
resource "aws_s3_bucket" "static" {
  bucket = local.bucket_name
}

resource "aws_s3_bucket_public_access_block" "static" {
  bucket = aws_s3_bucket.static.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "static" {
  name                              = "${var.project_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "static" {
  enabled             = true
  default_root_object = "taskpane.html"
  price_class         = "PriceClass_All"

  origin {
    domain_name              = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id                = "s3-${local.bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.static.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-${local.bucket_name}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    # AWS managed CachingOptimized policy
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  # SPA fallback — 403/404 from S3 → serve taskpane.html
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/taskpane.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/taskpane.html"
    error_caching_min_ttl = 0
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

# ─── Managed CDN ───────────────────────────────────────────

resource "aws_s3_bucket" "managed" {
  bucket = local.bucket_name_managed
}

resource "aws_s3_bucket_public_access_block" "managed" {
  bucket = aws_s3_bucket.managed.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_control" "managed" {
  name                              = "${var.project_name}-oac-managed"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "managed" {
  enabled             = true
  default_root_object = "taskpane.html"
  price_class         = "PriceClass_All"

  origin {
    domain_name              = aws_s3_bucket.managed.bucket_regional_domain_name
    origin_id                = "s3-${local.bucket_name_managed}"
    origin_access_control_id = aws_cloudfront_origin_access_control.managed.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-${local.bucket_name_managed}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/taskpane.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/taskpane.html"
    error_caching_min_ttl = 0
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

resource "aws_s3_bucket_policy" "managed" {
  bucket = aws_s3_bucket.managed.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.managed.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.managed.arn
          }
        }
      }
    ]
  })
}

# ─── Power CDN bucket policy ────────────────────────────────

# S3 bucket policy — allow GetObject only from CloudFront OAC
resource "aws_s3_bucket_policy" "static" {
  bucket = aws_s3_bucket.static.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.static.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.static.arn
          }
        }
      }
    ]
  })
}
