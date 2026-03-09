import type { Api, Model } from "@mariozechner/pi-ai";
import { loadOAuthCredentials } from "./oauth";

export type ThinkingLevel = "none" | "low" | "medium" | "high";

export const EXCELOS_AI_PROVIDER = "excelos-ai";
export const EXCELOS_AI_MODEL_ID = "claude-sonnet-4-6";
export const BEDROCK_PROXY_URL: string =
  import.meta.env.VITE_BEDROCK_PROXY_URL ?? "";

export function buildExcelosModel(): Model<any> | null {
  if (!BEDROCK_PROXY_URL) return null;
  return {
    id: EXCELOS_AI_MODEL_ID,
    name: "Claude Sonnet 4.6 (ExcelOS AI)",
    api: "anthropic-messages" as Api,
    provider: EXCELOS_AI_PROVIDER as any,
    baseUrl: BEDROCK_PROXY_URL,
    reasoning: true,
    input: ["text", "image"] as ("text" | "image")[],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 200000,
    maxTokens: 64000,
  };
}

export interface ProviderConfig {
  provider: string;
  apiKey: string;
  model: string;
  useProxy: boolean;
  proxyUrl: string;
  thinking: ThinkingLevel;
  followMode: boolean;
  apiType?: string;
  customBaseUrl?: string;
  authMethod?: "apikey" | "oauth";
}

const STORAGE_KEY = "excelos-provider-config";

export const THINKING_LEVELS: { value: ThinkingLevel; label: string }[] = [
  { value: "none", label: "None" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const API_TYPES = [
  {
    id: "openai-completions",
    name: "OpenAI Completions",
    hint: "Most compatible — Ollama, vLLM, LMStudio, etc.",
  },
  {
    id: "openai-responses",
    name: "OpenAI Responses",
    hint: "Newer OpenAI API format",
  },
  { id: "anthropic-messages", name: "Anthropic Messages", hint: "Claude API" },
  {
    id: "google-generative-ai",
    name: "Google Generative AI",
    hint: "Gemini API",
  },
  {
    id: "azure-openai-responses",
    name: "Azure OpenAI Responses",
    hint: "Azure-hosted OpenAI",
  },
  {
    id: "openai-codex-responses",
    name: "OpenAI Codex Responses",
    hint: "ChatGPT subscription models",
  },
  {
    id: "google-gemini-cli",
    name: "Google Gemini CLI",
    hint: "Cloud Code Assist",
  },
  { id: "google-vertex", name: "Google Vertex AI", hint: "Vertex AI endpoint" },
];

export function loadSavedConfig(): ProviderConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const config = JSON.parse(saved);
      if (config.proxyUrl === undefined) config.proxyUrl = "";
      if (config.followMode === undefined) config.followMode = true;
      if (config.apiType === undefined) config.apiType = "";
      if (config.customBaseUrl === undefined) config.customBaseUrl = "";
      if (config.authMethod === undefined) config.authMethod = "apikey";
      if (config.provider === EXCELOS_AI_PROVIDER) {
        // SSO token is fetched fresh at call time — never store it
        config.apiKey = "";
      } else if (config.authMethod === "oauth") {
        const creds = loadOAuthCredentials(config.provider);
        if (creds) config.apiKey = creds.access;
      }
      return config;
    }
  } catch {}
  return null;
}

export function saveConfig(config: ProviderConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function buildCustomModel(config: ProviderConfig): Model<any> | null {
  if (!config.apiType || !config.customBaseUrl || !config.model) return null;
  return {
    id: config.model,
    name: config.model,
    api: config.apiType as Api,
    provider: "custom" as any,
    baseUrl: config.customBaseUrl,
    reasoning: true,
    input: ["text", "image"] as ("text" | "image")[],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 128000,
    maxTokens: 32000,
  };
}

export function applyProxyToModel(
  model: Model<any>,
  config: ProviderConfig,
): Model<any> {
  if (!config.useProxy || !config.proxyUrl || !model.baseUrl) return model;
  return {
    ...model,
    baseUrl: `${config.proxyUrl}/?url=${encodeURIComponent(model.baseUrl)}`,
  };
}
