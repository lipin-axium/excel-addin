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

const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION ?? process.env.BEDROCK_REGION ?? "ap-southeast-1",
});

/**
 * Decode a JWT payload without verifying the signature.
 * Performs minimal validation: checks expiry and issuer.
 * @param {string} token
 * @returns {{ email: string }}
 */
function extractEmailFromJwt(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Missing token");
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  } catch {
    throw new Error("Failed to decode token");
  }

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  const iss = payload.iss ?? "";
  if (
    !iss.includes("login.microsoftonline.com") &&
    !iss.includes("sts.windows.net")
  ) {
    throw new Error("Invalid token issuer");
  }

  const email =
    payload.preferred_username ??
    payload.email ??
    payload.upn ??
    payload.unique_name;

  if (!email || typeof email !== "string") {
    throw new Error("No email claim in token");
  }

  return { email };
}

/**
 * Atomically increment the daily request counter for a user.
 * Skips rate limiting when DAILY_LIMIT=0.
 * @param {string} email
 */
async function checkAndIncrementRateLimit(email) {
  const limit = parseInt(process.env.DAILY_LIMIT ?? "0", 10);
  if (!Number.isFinite(limit) || limit <= 0) {
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const pk = `${email}#${today}`;
  const ttlSeconds = Math.floor(Date.now() / 1000) + 172800;

  try {
    await dynamo.send(
      new UpdateItemCommand({
        TableName: process.env.RATE_LIMIT_TABLE,
        Key: { pk: { S: pk } },
        UpdateExpression:
          "SET #c = if_not_exists(#c, :zero) + :one, #ttl = :ttl",
        ConditionExpression:
          "attribute_not_exists(#c) OR #c < :limit",
        ExpressionAttributeNames: {
          "#c": "count",
          "#ttl": "ttl",
        },
        ExpressionAttributeValues: {
          ":zero": { N: "0" },
          ":one": { N: "1" },
          ":ttl": { N: String(ttlSeconds) },
          ":limit": { N: String(limit) },
        },
      }),
    );
  } catch (err) {
    if (err && err.name === "ConditionalCheckFailedException") {
      throw new Error("Daily limit reached. Please try again tomorrow.");
    }
    throw err;
  }
}

/**
 * Convert incoming Anthropic Messages API body into a Bedrock-compatible payload.
 * @param {Record<string, any>} body
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
 * Safely get a header value regardless of casing.
 * @param {Record<string, string | undefined> | undefined} headers
 * @param {string} name
 * @returns {string}
 */
function getHeader(headers, name) {
  if (!headers) return "";
  const target = name.toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === target) {
      return value ?? "";
    }
  }
  return "";
}

/**
 * Create a streaming response wrapper with SSE headers.
 * @param {any} rawStream
 * @param {number} statusCode
 * @param {string} allowedOrigin
 */
function createHttpStream(rawStream, statusCode, allowedOrigin) {
  return awslambda.HttpResponseStream.from(rawStream, {
    statusCode,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "access-control-allow-origin": allowedOrigin,
      "access-control-allow-headers":
        "content-type,x-api-key,anthropic-version,anthropic-beta",
      "access-control-allow-methods": "POST,OPTIONS",
    },
  });
}

/**
 * Write an SSE event.
 * @param {any} stream
 * @param {string} eventName
 * @param {any} data
 */
function writeSseEvent(stream, eventName, data) {
  stream.write(`event: ${eventName}\n`);
  stream.write(`data: ${JSON.stringify(data)}\n\n`);
}

/**
 * Send a single SSE error response and close the stream.
 * @param {any} rawStream
 * @param {number} statusCode
 * @param {string} allowedOrigin
 * @param {string} message
 */
function sendErrorResponse(rawStream, statusCode, allowedOrigin, message) {
  const stream = createHttpStream(rawStream, statusCode, allowedOrigin);
  writeSseEvent(stream, "error", {
    type: "error",
    error: {
      type: "api_error",
      message,
    },
  });
  stream.end();
}

exports.handler = awslambda.streamifyResponse(async (event, rawResponseStream) => {
  const method = event.requestContext?.http?.method ?? event.httpMethod ?? "";
  const allowedOrigin = process.env.ALLOWED_ORIGIN ?? "*";
  const headers = event.headers ?? {};

  console.log("[Handler] method:", method);
  console.log("[Handler] path:", event.rawPath ?? event.path ?? "/");
  console.log("[Handler] header keys:", Object.keys(headers));

  if (method === "OPTIONS") {
    const optionsStream = awslambda.HttpResponseStream.from(rawResponseStream, {
      statusCode: 200,
      headers: {
        "access-control-allow-origin": allowedOrigin,
        "access-control-allow-headers":
          "content-type,x-api-key,anthropic-version,anthropic-beta",
        "access-control-allow-methods": "POST,OPTIONS",
        "access-control-max-age": "86400",
      },
    });
    optionsStream.end();
    return;
  }

  if (method !== "POST") {
    sendErrorResponse(
      rawResponseStream,
      405,
      allowedOrigin,
      "Method not allowed. Use POST.",
    );
    return;
  }

  const originSecret = getHeader(headers, "x-origin-verify");
  if (
    !process.env.ORIGIN_SECRET ||
    originSecret !== process.env.ORIGIN_SECRET
  ) {
    console.warn("[Handler] Origin secret mismatch or missing");
    sendErrorResponse(
      rawResponseStream,
      403,
      allowedOrigin,
      "Forbidden: Invalid origin",
    );
    return;
  }

  const rawToken = getHeader(headers, "x-api-key");
  console.log(
    "[Handler] token present:",
    !!rawToken,
    "token length:",
    rawToken.length,
  );

  let email;
  try {
    ({ email } = extractEmailFromJwt(rawToken));
    console.log("[Handler] authenticated as:", email);
  } catch (err) {
    console.warn("[Handler] auth failed:", err?.message ?? err);
    sendErrorResponse(
      rawResponseStream,
      401,
      allowedOrigin,
      `Authentication failed: ${err?.message ?? "Unknown error"}`,
    );
    return;
  }

  try {
    await checkAndIncrementRateLimit(email);
  } catch (err) {
    sendErrorResponse(
      rawResponseStream,
      429,
      allowedOrigin,
      err?.message ?? "Rate limit error",
    );
    return;
  }

  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    sendErrorResponse(rawResponseStream, 400, allowedOrigin, "Invalid JSON body");
    return;
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    sendErrorResponse(
      rawResponseStream,
      400,
      allowedOrigin,
      "Missing required field: messages",
    );
    return;
  }

  const responseStream = createHttpStream(rawResponseStream, 200, allowedOrigin);

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

    for await (const chunk of response.body) {
      if (!chunk.chunk?.bytes) continue;

      const decoded = JSON.parse(
        Buffer.from(chunk.chunk.bytes).toString("utf8"),
      );

      const eventName =
        typeof decoded.type === "string" && decoded.type.length > 0
          ? decoded.type
          : "message";

      writeSseEvent(responseStream, eventName, decoded);
    }
  } catch (err) {
    console.error("[Bedrock] Stream error:", err);
    writeSseEvent(responseStream, "error", {
      type: "error",
      error: {
        type: "api_error",
        message:
          err?.name === "AccessDeniedException"
            ? "Model access not enabled. Contact your administrator."
            : `Bedrock error: ${err?.message ?? "Unknown error"}`,
      },
    });
  }

  responseStream.end();
});