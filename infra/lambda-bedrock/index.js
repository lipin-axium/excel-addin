// @ts-check
"use strict";

const {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");

const bedrock = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION ?? "ap-southeast-1",
});
const dynamo = new DynamoDBClient({});

/**
 * Decode a JWT payload without verifying the signature.
 * Performs minimal validation: checks expiry and issuer.
 * @param {string} token
 * @returns {{ email: string }}
 */
function extractEmailFromJwt(token) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token format");

  let payload;
  try {
    payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  } catch {
    throw new Error("Failed to decode token");
  }

  // Check expiry
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  // Check issuer is from Microsoft
  const iss = payload.iss ?? "";
  if (!iss.includes("login.microsoftonline.com") && !iss.includes("sts.windows.net")) {
    throw new Error("Invalid token issuer");
  }

  const email =
    payload.preferred_username ??
    payload.email ??
    payload.upn ??
    payload.unique_name;

  if (!email) throw new Error("No email claim in token");

  return { email };
}

/**
 * Atomically increment the daily request counter for a user.
 * Skips rate limiting when DAILY_LIMIT=0.
 * @param {string} email
 */
async function checkAndIncrementRateLimit(email) {
  const limit = parseInt(process.env.DAILY_LIMIT ?? "0", 10);
  if (limit === 0) return; // Rate limiting disabled

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const pk = `${email}#${today}`;
  const ttlSeconds = Math.floor(Date.now() / 1000) + 172800; // 48 hours

  try {
    await dynamo.send(
      new UpdateItemCommand({
        TableName: process.env.RATE_LIMIT_TABLE,
        Key: { pk: { S: pk } },
        UpdateExpression:
          "SET #c = if_not_exists(#c, :zero) + :one, #ttl = :ttl",
        ConditionExpression:
          "attribute_not_exists(#c) OR #c < :limit",
        ExpressionAttributeNames: { "#c": "count", "#ttl": "ttl" },
        ExpressionAttributeValues: {
          ":zero": { N: "0" },
          ":one": { N: "1" },
          ":ttl": { N: String(ttlSeconds) },
          ":limit": { N: String(limit) },
        },
      }),
    );
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      throw new Error("Daily limit reached. Please try again tomorrow.");
    }
    throw err;
  }
}

/**
 * Convert an incoming Anthropic Messages API body into a Bedrock-compatible
 * payload. Bedrock uses the same format but requires `anthropic_version`
 * and does not accept the `stream` field.
 * @param {Record<string, unknown>} body
 */
function buildBedrockPayload(body) {
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: body.max_tokens ?? 8192,
    messages: body.messages,
  };
  if (body.system) payload.system = body.system;
  if (body.tools) payload.tools = body.tools;
  if (body.tool_choice) payload.tool_choice = body.tool_choice;
  if (body.thinking) payload.thinking = body.thinking;
  if (body.temperature !== undefined) payload.temperature = body.temperature;
  if (body.top_p !== undefined) payload.top_p = body.top_p;
  if (body.top_k !== undefined) payload.top_k = body.top_k;
  if (body.stop_sequences) payload.stop_sequences = body.stop_sequences;
  return payload;
}

/**
 * Main handler — uses awslambda.streamifyResponse for HTTP response streaming.
 * The Lambda Function URL must be configured with invoke_mode = "RESPONSE_STREAM".
 */
exports.handler = awslambda.streamifyResponse(async (event, responseStream) => {
  const method = event.requestContext?.http?.method ?? event.httpMethod ?? "";
  const allowedOrigin = process.env.ALLOWED_ORIGIN ?? "*";

  // CORS preflight (handled by Function URL config, but defensive):
  if (method === "OPTIONS") {
    responseStream.end();
    return;
  }

  /**
   * Write an SSE error event and close the stream.
   * @param {string} message
   * @param {number} [status]
   */
  function sendError(message) {
    responseStream.write(
      `event: error\ndata: ${JSON.stringify({ type: "error", error: { type: "api_error", message } })}\n\n`,
    );
    responseStream.end();
  }

  // ── 1. Authenticate ──────────────────────────────────────────────────────
  const rawToken =
    event.headers?.["x-api-key"] ?? event.headers?.["X-Api-Key"] ?? "";

  let email;
  try {
    ({ email } = extractEmailFromJwt(rawToken));
  } catch (err) {
    return sendError(`Authentication failed: ${err.message}`);
  }

  // ── 2. Rate limit ────────────────────────────────────────────────────────
  try {
    await checkAndIncrementRateLimit(email);
  } catch (err) {
    return sendError(err.message);
  }

  // ── 3. Parse request body ────────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return sendError("Invalid JSON body");
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    return sendError("Missing required field: messages");
  }

  // ── 4. Call Bedrock ──────────────────────────────────────────────────────
  const modelId =
    process.env.BEDROCK_MODEL_ID ??
    "ap.anthropic.claude-sonnet-4-6-20250514-v1:0";

  const bedrockPayload = buildBedrockPayload(body);

  const command = new InvokeModelWithResponseStreamCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(bedrockPayload),
  });

  try {
    const response = await bedrock.send(command);

    // ── 5. Stream response back as Anthropic SSE ─────────────────────────
    // Bedrock's Anthropic model returns chunks in Anthropic Messages SSE format,
    // so we just re-emit each chunk as an SSE event.
    for await (const chunk of response.body) {
      if (chunk.chunk?.bytes) {
        const decoded = JSON.parse(
          Buffer.from(chunk.chunk.bytes).toString("utf8"),
        );
        // Bedrock chunks already have a `type` field matching Anthropic SSE types
        responseStream.write(
          `event: ${decoded.type}\ndata: ${JSON.stringify(decoded)}\n\n`,
        );
      }
    }
  } catch (err) {
    console.error("[Bedrock] Stream error:", err);
    return sendError(
      err.name === "AccessDeniedException"
        ? "Model access not enabled. Contact your administrator."
        : `Bedrock error: ${err.message}`,
    );
  }

  responseStream.end();
});
