# Bedrock Streaming Proxy Architecture

This service provides a secure streaming proxy for Amazon Bedrock (Anthropic Claude) using AWS Lambda and CloudFront. It allows frontend clients to invoke Claude models through a controlled backend endpoint without exposing Bedrock credentials.

The proxy streams model responses using Server-Sent Events (SSE) so clients receive tokens incrementally.

## Architecture Diagram

```text
┌───────────────────────┐
│   Client / Frontend   │
│  Browser or App UI    │
└───────────┬───────────┘
            │
            │ HTTPS POST
            │ x-api-key: <JWT>
            ▼
┌───────────────────────┐
│      CloudFront       │
│   Public API Edge     │
│                       │
│ - Accepts POST        │
│ - Forwards headers    │
│ - Adds x-origin-verify│
│ - Returns SSE stream  │
└───────────┬───────────┘
            │
            │ HTTPS origin request
            │ x-origin-verify: <secret>
            ▼
┌───────────────────────┐
│  Lambda Function URL  │
│  RESPONSE_STREAM mode │
│  AuthType = NONE      │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   AWS Lambda Proxy    │
│      index.js         │
│                       │
│ - Validates secret    │
│ - Parses JWT          │
│ - Checks rate limit   │
│ - Calls Bedrock       │
│ - Re-emits SSE        │
└───────┬─────────┬─────┘
        │         │
        │         │
        │         ▼
        │   ┌───────────────────────┐
        │   │      DynamoDB         │
        │   │   Rate Limit Table    │
        │   │ email#YYYY-MM-DD      │
        │   └───────────────────────┘
        │
        ▼
┌───────────────────────┐
│    Amazon Bedrock     │
│  Anthropic Claude     │
│ InvokeModelWith       │
│ ResponseStream        │
└───────────┬───────────┘
            │
            │ Streaming chunks
            ▼
┌───────────────────────┐
│      AWS Lambda       │
│ Converts chunks to    │
│ SSE events            │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│      CloudFront       │
│ Streams SSE response  │
│ back to client        │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   Client / Frontend   │
│ Receives token stream │
└───────────────────────┘
## Request Flow

The client sends a POST request to the public CloudFront URL.

The client includes:

content-type: application/json

x-api-key: <JWT>

CloudFront forwards the request to the Lambda Function URL.

CloudFront injects:

x-origin-verify: <secret>

Lambda validates:

origin secret

JWT claims

optional rate limits

Lambda sends the prompt to Amazon Bedrock using InvokeModelWithResponseStream.

Bedrock returns streaming model chunks.

Lambda converts those chunks into SSE events.

CloudFront streams the SSE response back to the client.

## Components

### CloudFront

CloudFront is the public entry point for the proxy.

Responsibilities:

exposes the public endpoint

forwards POST requests to Lambda

injects a secret header to identify trusted traffic

forwards required headers such as x-api-key and content-type

returns streaming responses to the client

Important configuration:

compress = false

Compression must be disabled so streaming responses are not buffered.

### Lambda Function URL

Lambda is exposed through a Function URL configured with:

authorization_type = "NONE"
invoke_mode        = "RESPONSE_STREAM"

This allows:

direct HTTP invocation

response streaming via SSE

Required Lambda permissions:

lambda:InvokeFunctionUrl

lambda:InvokeFunction

### Lambda (Bedrock Proxy)

The Lambda function acts as the backend gateway.

Responsibilities:

1. Validate request origin

Requests must include:

x-origin-verify: <secret>

Only CloudFront adds this header.

This protects the public Function URL from direct bypass traffic.

2. Authenticate the user

The client sends:

x-api-key: <JWT>

The Lambda:

decodes the JWT payload

checks expiration

validates issuer

extracts the user email

Warning: the current implementation does not verify JWT signatures yet.

3. Apply rate limiting

Requests are tracked per user per day in DynamoDB.

Key format:

email#YYYY-MM-DD

Environment variable:

DAILY_LIMIT

Set DAILY_LIMIT=0 to disable rate limiting.

4. Call Amazon Bedrock

Lambda invokes Claude using:

InvokeModelWithResponseStream

Example model:

global.anthropic.claude-sonnet-4-6

Bedrock returns streamed chunks.

5. Stream results back to the client

Lambda converts Bedrock chunks into SSE events:

event: content_block_delta
data: {...}

The client receives tokens incrementally.

### DynamoDB

DynamoDB stores per-user daily usage for rate limiting.

Example table design:

table: <project>-rate-limits
hash key: pk

Example key:

user@example.com#2026-03-09

TTL is enabled so old counters expire automatically.

## Security Model

Security is layered.

### Layer 1 — CloudFront origin secret

CloudFront injects:

x-origin-verify

Lambda rejects requests missing this value.

### Layer 2 — JWT authentication

The client sends:

x-api-key

Lambda extracts the user identity from the token.

### Layer 3 — Rate limiting

DynamoDB can enforce per-user daily request limits.

### Layer 4 — AWS boundary

All model invocation stays inside AWS via Bedrock.

No third-party LLM relay is required.

## Example Request

```http
POST /chat
Content-Type: application/json
x-api-key: <JWT>

{
  "messages": [
    {
      "role": "user",
      "content": "Say hello world in 3 words"
    }
  ]
}
```
## Example Streaming Response

```text
event: message_start
data: {...}

event: content_block_delta
data: {"text":"Hello"}

event: content_block_delta
data: {"text":" world"}

event: message_stop
```
## Environment Variables
BEDROCK_REGION
BEDROCK_MODEL_ID
RATE_LIMIT_TABLE
DAILY_LIMIT
ORIGIN_SECRET
## Terraform Resources

Key infrastructure resources:

aws_lambda_function
aws_lambda_function_url
aws_lambda_permission
aws_cloudfront_distribution
aws_cloudfront_origin_request_policy
aws_cloudfront_response_headers_policy
aws_dynamodb_table
aws_iam_role
## Why a Separate CloudFront Distribution Exists for Bedrock

A separate CloudFront distribution is used for the Bedrock proxy because this endpoint behaves like a streaming API, not a static site.

It needs:

different origin type: Lambda Function URL instead of S3

different forwarded headers

disabled compression for streaming

disabled caching for live model responses

API-specific security behavior

This keeps the LLM streaming path isolated from static frontend delivery.

## Future Improvements

### Verify JWT signatures

Validate Microsoft tokens using Azure AD JWKS instead of only checking payload claims.

### Move origin secret

Store ORIGIN_SECRET in AWS Secrets Manager or SSM Parameter Store.

### Add WAF

Protect CloudFront from abuse and bad traffic.

### Add structured logging

Include request IDs, user IDs, latency, and usage metrics.

## Summary

This system implements a secure Bedrock streaming proxy with:

Claude streaming via SSE

CloudFront public endpoint

Lambda backend proxy

JWT-based app authentication

DynamoDB rate limiting

no third-party LLM gateways

## One-Line Summary

This architecture is a CloudFront-fronted Lambda streaming proxy for Amazon Bedrock, secured by a custom origin secret plus app-level JWT checks, with optional DynamoDB rate limiting and SSE streaming back to the client.

## Example to try

```bash
curl -N -X POST https://d23k6t7mldw0hz.cloudfront.net/ \
  -H "content-type: application/json" \
  -H "x-api-key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4OTM0NTYwMDAsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L3Rlc3QvIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.abc" \
  -d '{"messages":[{"role":"user","content":"Say hello world in 3 words"}]}'
```