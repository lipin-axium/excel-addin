export interface McpServerConfig {
  id: string;
  url: string;
  enabled: boolean;
}

const STORAGE_KEY = "openexcel-mcp-servers";
// Legacy key from single-server implementation
const LEGACY_KEY = "openexcel-mcp-config";

export function loadMcpServers(): McpServerConfig[] {
  try {
    // Migrate legacy single-server config
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as { serverUrl?: string; enabled?: boolean };
      if (parsed.serverUrl) {
        const migrated: McpServerConfig[] = [
          { id: crypto.randomUUID(), url: parsed.serverUrl, enabled: parsed.enabled ?? false },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        localStorage.removeItem(LEGACY_KEY);
        return migrated;
      }
      localStorage.removeItem(LEGACY_KEY);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as McpServerConfig[];
  } catch {
    return [];
  }
}

export function saveMcpServers(servers: McpServerConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
}

export function addMcpServer(url: string): McpServerConfig {
  const server: McpServerConfig = { id: crypto.randomUUID(), url, enabled: false };
  const servers = loadMcpServers();
  servers.push(server);
  saveMcpServers(servers);
  return server;
}

export function updateMcpServer(id: string, patch: Partial<McpServerConfig>) {
  const servers = loadMcpServers().map((s) =>
    s.id === id ? { ...s, ...patch } : s,
  );
  saveMcpServers(servers);
}

export function removeMcpServer(id: string) {
  saveMcpServers(loadMcpServers().filter((s) => s.id !== id));
}
