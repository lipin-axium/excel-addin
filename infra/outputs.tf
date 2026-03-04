output "cloudfront_url" {
  description = "CloudFront HTTPS URL — use as VITE_PROD_URL secret (with trailing slash)"
  value       = "https://${aws_cloudfront_distribution.static.domain_name}/"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — use as AWS_CLOUDFRONT_DISTRIBUTION_ID secret"
  value       = aws_cloudfront_distribution.static.id
}

output "s3_bucket_name" {
  description = "S3 bucket name — use as AWS_S3_BUCKET secret"
  value       = aws_s3_bucket.static.bucket
}

output "iam_access_key_id" {
  description = "CI IAM access key ID — use as AWS_ACCESS_KEY_ID secret"
  value       = aws_iam_access_key.ci.id
}

output "iam_secret_access_key" {
  description = "CI IAM secret access key — use as AWS_SECRET_ACCESS_KEY secret"
  value       = aws_iam_access_key.ci.secret
  sensitive   = true
}
