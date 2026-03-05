import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  FunctionSquare,
  Grid3X3,
  MessageSquare,
  Moon,
  Plus,
  Settings,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";
import {
  type DragEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getSessionMessageCount } from "../../../lib/storage";
import { saveConfig } from "../../../lib/provider-config";
import { ChatProvider, useChat } from "./chat-context";
import { ChatInput } from "./chat-input";
import { FormulaPanel } from "./formula-panel";
import { MessageList } from "./message-list";
import { SettingsPanel } from "./settings-panel";
import type { ChatTab } from "./types";

const IS_MANAGED = __APP_MODE__ === "managed";
const MANAGED_API_KEY = "excelos-managed-api-key";

type Theme = "light" | "dark";
const THEME_KEY = "excelos-theme";

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    const initial = saved ?? "light";
    document.documentElement.setAttribute("data-theme", initial);
    return initial;
  });

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    setTheme(next);
  };

  return { theme, toggle };
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

function formatCost(n: number): string {
  if (n < 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(3)}`;
}

function StatsBar() {
  const { state } = useChat();
  const { sessionStats, providerConfig } = state;

  if (!providerConfig) return null;

  const contextPct =
    sessionStats.contextWindow > 0 && sessionStats.lastInputTokens > 0
      ? (
          (sessionStats.lastInputTokens / sessionStats.contextWindow) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div
      className="px-3 py-1.5 text-[10px] border-t border-(--chat-border) bg-(--chat-bg-secondary) text-(--chat-text-muted)"
      style={{ fontFamily: "var(--chat-font-sans)" }}
    >
      <div className="flex items-center gap-3">
        <span title="Input tokens">
          ↑{formatTokens(sessionStats.inputTokens)}
        </span>
        <span title="Output tokens">
          ↓{formatTokens(sessionStats.outputTokens)}
        </span>
        {sessionStats.cacheRead > 0 && (
          <span title="Cache read tokens">
            R{formatTokens(sessionStats.cacheRead)}
          </span>
        )}
        {sessionStats.cacheWrite > 0 && (
          <span title="Cache write tokens">
            W{formatTokens(sessionStats.cacheWrite)}
          </span>
        )}
        <span title="Total cost">{formatCost(sessionStats.totalCost)}</span>
        {sessionStats.contextWindow > 0 && (
          <span title="Context usage">
            {contextPct}%/{formatTokens(sessionStats.contextWindow)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 mt-0.5">
        <span>{providerConfig.provider}</span>
        <span className="text-(--chat-text-secondary)">
          {providerConfig.model}
        </span>
        {providerConfig.thinking !== "none" && (
          <span className="text-(--chat-accent)">
            • {providerConfig.thinking}
          </span>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium
        border-b-2 transition-colors -mb-px
        ${
          active
            ? "border-(--chat-accent) text-(--chat-accent)"
            : "border-transparent text-(--chat-text-secondary) hover:text-(--chat-text-primary)"
        }
      `}
      style={{ fontFamily: "var(--chat-font-sans)" }}
    >
      {children}
    </button>
  );
}

function SessionDropdown({ onSelect }: { onSelect: () => void }) {
  const { state, newSession, switchSession, deleteCurrentSession } = useChat();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isStreaming = state.isStreaming;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const currentName = state.currentSession?.name ?? "New Chat";
  const truncatedName =
    currentName.length > 20 ? `${currentName.slice(0, 18)}…` : currentName;

  const handleNewSession = async () => {
    console.log("[UI] handleNewSession clicked");
    await newSession();
    console.log("[UI] newSession completed");
    setOpen(false);
    onSelect();
  };

  const handleSwitch = async (id: string) => {
    await switchSession(id);
    setOpen(false);
    onSelect();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium
          border-b-2 border-(--chat-accent) text-(--chat-accent) transition-colors -mb-px
        `}
        style={{ fontFamily: "var(--chat-font-sans)" }}
      >
        <MessageSquare size={14} />
        <span className="max-w-[110px] truncate">{truncatedName}</span>
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 w-56 bg-(--chat-bg) border border-(--chat-border) shadow-lg z-50 overflow-hidden"
          style={{
            fontFamily: "var(--chat-font-sans)",
            borderRadius: "var(--chat-radius)",
          }}
        >
          <button
            type="button"
            onClick={handleNewSession}
            disabled={isStreaming}
            className={`w-full flex items-center gap-2 px-3 py-2.5 text-[13px] font-medium transition-colors border-b border-(--chat-border) ${
              isStreaming
                ? "text-(--chat-text-muted) cursor-not-allowed"
                : "text-(--chat-accent) hover:bg-(--chat-bg-secondary)"
            }`}
          >
            <Plus size={14} />
            New Chat
          </button>

          <div className="max-h-48 overflow-y-auto">
            {state.sessions.map((session) => {
              const isCurrent = session.id === state.currentSession?.id;
              const isDisabled = isStreaming && !isCurrent;
              return (
                <button
                  type="button"
                  key={session.id}
                  disabled={isDisabled}
                  className={`
                    flex items-center justify-between px-3 py-2 text-[12.5px] transition-colors w-full text-left
                    ${isCurrent ? "bg-(--chat-bg-secondary)" : ""}
                    ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-(--chat-bg-secondary)"}
                  `}
                  onClick={() => handleSwitch(session.id)}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {session.id === state.currentSession?.id ? (
                      <Check
                        size={12}
                        className="text-(--chat-accent) shrink-0"
                      />
                    ) : (
                      <div className="w-3 shrink-0" />
                    )}
                    <span className="truncate text-(--chat-text-primary)">
                      {session.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-(--chat-text-muted) shrink-0 ml-2">
                    {getSessionMessageCount(session)}
                  </span>
                </button>
              );
            })}
          </div>

          {state.sessions.length > 1 && state.currentSession && (
            <button
              type="button"
              disabled={isStreaming}
              onClick={async (e) => {
                e.stopPropagation();
                await deleteCurrentSession();
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors border-t border-(--chat-border) ${
                isStreaming
                  ? "text-(--chat-text-muted) cursor-not-allowed"
                  : "text-(--chat-error) hover:bg-(--chat-bg-secondary)"
              }`}
            >
              <Trash2 size={14} />
              Delete Current Session
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ChatHeader({
  activeTab,
  onTabChange,
  theme,
  onThemeToggle,
}: {
  activeTab: ChatTab;
  onTabChange: (tab: ChatTab) => void;
  theme: Theme;
  onThemeToggle: () => void;
}) {
  const { clearMessages, state, toggleFollowMode } = useChat();
  const followMode = state.providerConfig?.followMode ?? true;

  return (
    <div className="shrink-0 bg-(--chat-bg)">
      {/* ─── Brand bar ─── */}
      <div className="header-gradient-line">
        <div className="flex items-center justify-between px-4 h-[44px]">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 shrink-0 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--chat-accent) 0%, #272bb0 100%)",
                borderRadius: "6px",
              }}
            >
              <Grid3X3 size={13} className="text-white" />
            </div>
            <span
              className="text-base text-(--chat-text-primary)"
              style={{
                fontFamily: "Kiona, var(--chat-font-sans)",
                letterSpacing: "0.18em",
                fontWeight: 400,
              }}
            >
              <span style={{ fontWeight: 700 }}>Excel</span> OS
            </span>
            <span
              className="text-[9px] text-(--chat-text-muted)"
              style={{
                fontFamily: "var(--chat-font-sans)",
                letterSpacing: "0.05em",
              }}
            >
              powered by Axium
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {state.mcpTools.length > 0 && (
              <div
                className="flex items-center gap-1 px-2 text-[10px] text-green-500"
                style={{ fontFamily: "var(--chat-font-sans)" }}
                title={`${state.mcpTools.length} MCP tool${state.mcpTools.length === 1 ? "" : "s"} connected`}
              >
                <span className="mcp-indicator-dot" />
                <span>MCP</span>
              </div>
            )}
            {activeTab === "chat" && (
              <button
                type="button"
                onClick={toggleFollowMode}
                className={`p-1.5 transition-colors ${
                  followMode
                    ? "text-(--chat-accent) hover:text-(--chat-text-primary)"
                    : "text-(--chat-text-muted) hover:text-(--chat-text-primary)"
                }`}
              >
                {followMode ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            )}
            <button
              type="button"
              onClick={onThemeToggle}
              className="p-1.5 text-(--chat-text-muted) hover:text-(--chat-text-primary) transition-colors"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            {activeTab === "chat" && state.messages.length > 0 && (
              <button
                type="button"
                onClick={clearMessages}
                className="p-1.5 text-(--chat-text-muted) hover:text-(--chat-error) transition-colors"
                title="Clear messages"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Tab bar ─── */}
      <div className="flex items-stretch px-4 border-b border-(--chat-border)">
        {activeTab === "chat" ? (
          <SessionDropdown onSelect={() => onTabChange("chat")} />
        ) : (
          <TabButton active={false} onClick={() => onTabChange("chat")}>
            <MessageSquare size={14} />
            Chat
          </TabButton>
        )}
        <TabButton
          active={activeTab === "formula"}
          onClick={() => onTabChange("formula")}
        >
          <FunctionSquare size={14} />
          Formula
        </TabButton>
        {!IS_MANAGED && (
          <TabButton
            active={activeTab === "settings"}
            onClick={() => onTabChange("settings")}
          >
            <Settings size={14} />
            Settings
          </TabButton>
        )}
      </div>
    </div>
  );
}

function ManagedOnboarding({ onDone }: { onDone: () => void }) {
  const { availableProviders, getModelsForProvider } = useChat();
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);

  const models = provider ? getModelsForProvider(provider) : [];

  const handleProviderChange = (p: string) => {
    setProvider(p);
    setModel("");
  };

  const canSubmit = key.trim() && provider && model;

  const handleSubmit = () => {
    if (!canSubmit) return;
    saveConfig({
      provider,
      model,
      apiKey: key.trim(),
      useProxy: false,
      proxyUrl: "",
      thinking: "none",
      followMode: true,
      apiType: "",
      customBaseUrl: "",
      authMethod: "apikey",
    });
    localStorage.setItem(MANAGED_API_KEY, "1");
    onDone();
  };

  const selectClass =
    "w-full px-3 py-2.5 text-xs bg-(--chat-input-bg) border border-(--chat-border) text-(--chat-text-primary) outline-none focus:border-(--chat-accent) appearance-none cursor-pointer";
  const selectStyle = { borderRadius: "var(--chat-radius)", fontFamily: "var(--chat-font-sans)" };

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-8 gap-6"
      style={{ fontFamily: "var(--chat-font-sans)" }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div
          className="w-10 h-10 flex items-center justify-center mb-2"
          style={{
            background: "linear-gradient(135deg, var(--chat-accent) 0%, #272bb0 100%)",
            borderRadius: "10px",
          }}
        >
          <Grid3X3 size={18} className="text-white" />
        </div>
        <h2
          className="text-base text-(--chat-text-primary)"
          style={{ fontFamily: "Kiona, var(--chat-font-sans)", letterSpacing: "0.12em" }}
        >
          Welcome to Excel<span style={{ fontWeight: 700 }}>OS</span>
        </h2>
        <p className="text-xs text-(--chat-text-muted) leading-relaxed max-w-[220px]">
          Set up your AI provider to get started. You'll only need to do this once.
        </p>
      </div>

      <div className="w-full flex flex-col gap-2">
        {/* Provider */}
        <div className="relative">
          <select
            value={provider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className={selectClass}
            style={selectStyle}
          >
            <option value="">Select provider…</option>
            {availableProviders.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--chat-text-muted) pointer-events-none"
          />
        </div>

        {/* Model */}
        <div className="relative">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!provider || models.length === 0}
            className={selectClass + " disabled:opacity-50"}
            style={selectStyle}
          >
            <option value="">Select model…</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--chat-text-muted) pointer-events-none"
          />
        </div>

        {/* API Key */}
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="API key…"
            className="w-full px-3 py-2.5 text-xs bg-(--chat-input-bg) border border-(--chat-border) text-(--chat-text-primary) outline-none focus:border-(--chat-accent) pr-9"
            style={{ borderRadius: "var(--chat-radius)", fontFamily: "var(--chat-font-mono)" }}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--chat-text-muted) hover:text-(--chat-text-primary)"
          >
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-2.5 text-xs font-medium text-white bg-(--chat-accent) hover:opacity-90 transition-opacity disabled:opacity-40"
          style={{ borderRadius: "var(--chat-radius)" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function ChatContent() {
  const [activeTab, setActiveTab] = useState<ChatTab>("chat");
  const { theme, toggle } = useTheme();
  const { processFiles } = useChat();
  const [managedReady, setManagedReady] = useState(
    !IS_MANAGED || !!localStorage.getItem(MANAGED_API_KEY)
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles],
  );

  return (
    <div
      role="application"
      className="flex flex-col h-full bg-(--chat-bg) chat-dot-grid relative overflow-hidden"
      style={{ fontFamily: "var(--chat-font-sans)", borderRadius: "10px" }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ChatHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onThemeToggle={toggle}
      />
      {IS_MANAGED && !managedReady ? (
        <ManagedOnboarding onDone={() => setManagedReady(true)} />
      ) : activeTab === "formula" ? (
        <FormulaPanel />
      ) : activeTab === "chat" ? (
        <>
          <MessageList />
          <ChatInput />
          <StatsBar />
        </>
      ) : (
        <SettingsPanel />
      )}

      {/* Drag-and-drop overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-(--chat-bg)/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-(--chat-accent) rounded-lg">
            <Upload size={32} className="text-(--chat-accent)" />
            <span className="text-sm text-(--chat-text-primary)">
              Drop files here
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ChatInterface() {
  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
}
