import type { AgentTool } from "@mariozechner/pi-agent-core";

export interface McpToolDef {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

export interface McpPingResult {
  ok: boolean;
  toolCount?: number;
  tools?: McpToolDef[];
  error?: string;
}

function buildUrl(serverUrl: string): string {
  const url = serverUrl.replace(/\/+$/, ""); // strip trailing slash
  // If the URL already has /mcp in the path (e.g. .../mcp?mode=finnhub), use as-is
  try {
    const { pathname } = new URL(url);
    if (pathname.includes("/mcp")) return url;
  } catch {
    // Not a valid URL, fall through
  }
  return `${url}/mcp`;
}

async function jsonRpc(
  serverUrl: string,
  method: string,
  params?: unknown,
): Promise<unknown> {
  const url = buildUrl(serverUrl);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      ...(params ? { params } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `MCP server returned ${response.status} ${response.statusText}`,
    );
  }

  const json = (await response.json()) as {
    result?: unknown;
    error?: { message?: string };
  };

  if (json.error) {
    throw new Error(json.error.message ?? "MCP JSON-RPC error");
  }

  return json.result;
}

export async function fetchMcpTools(serverUrl: string): Promise<McpToolDef[]> {
  const result = (await jsonRpc(serverUrl, "tools/list")) as {
    tools?: McpToolDef[];
  };
  return result?.tools ?? [];
}

export async function callMcpTool(
  serverUrl: string,
  name: string,
  args: unknown,
): Promise<unknown> {
  return jsonRpc(serverUrl, "tools/call", { name, arguments: args });
}

export async function pingMcpServer(serverUrl: string): Promise<McpPingResult> {
  try {
    const tools = await fetchMcpTools(serverUrl);
    return { ok: true, toolCount: tools.length, tools };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function mcpToolToAgentTool(
  mcpTool: McpToolDef,
  serverUrl: string,
): AgentTool {
  // MCP inputSchema is standard JSON Schema — maps directly to AgentTool parameters
  const parameters: Record<string, unknown> = mcpTool.inputSchema ?? {
    type: "object",
    properties: {},
  };

  return {
    name: mcpTool.name,
    description: mcpTool.description ?? mcpTool.name,
    parameters,
    execute: async (_toolCallId: string, params: unknown) => {
      try {
        const raw = await callMcpTool(serverUrl, mcpTool.name, params);

        // MCP tools/call returns { content: [{ type, text }], isError }
        // Extract the text parts rather than stringifying the whole wrapper object.
        let text: string;
        if (
          raw &&
          typeof raw === "object" &&
          "content" in raw &&
          Array.isArray((raw as any).content)
        ) {
          const parts = (raw as any).content as {
            type: string;
            text?: string;
          }[];
          text = parts
            .filter((p) => p.type === "text" && typeof p.text === "string")
            .map((p) => p.text as string)
            .join("\n");
          if (!text) {
            // Fallback: stringify non-text parts
            text = JSON.stringify(parts, null, 2);
          }
        } else {
          text = typeof raw === "string" ? raw : JSON.stringify(raw, null, 2);
        }

        return {
          content: [{ type: "text" as const, text }],
          details: undefined,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ success: false, error: message }),
            },
          ],
          details: undefined,
        };
      }
    },
  } as AgentTool;
}
