import { code } from "@streamdown/code";
import {
  ArrowUpRight,
  Check,
  Copy,
  FunctionSquare,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Streamdown } from "streamdown";
import { getSelectedRangeData } from "../../../lib/excel/api";
import { useChat } from "./chat-context";

function buildPrompt(
  address: string,
  formula: string,
  explainOnly = false,
): string {
  if (explainOnly) {
    return `You are an Excel expert. Explain the following formula concisely for a non-technical user in 3-4 sentences. Do NOT include any suggestions or improvements — only explain what the formula does.

Cell: ${address}
Formula: ${formula}`;
  }
  return `You are an Excel expert. Explain the following formula concisely for a non-technical user in 3-4 sentences. Then add a section titled "## Suggestions" with 1-3 bullet points on how to improve or simplify it. For each suggestion that involves a formula change, include the improved formula in an inline code block (e.g. \`=XLOOKUP(...)\`). If the formula is already well-written, write "No improvements needed."

Cell: ${address}
Formula: ${formula}`;
}

/** Extract formulas from inline code blocks in the explanation text */
function extractSuggestedFormulas(text: string): string[] {
  const formulas: string[] = [];
  // Match inline code blocks containing formulas
  const regex = /`(=[^`]+)`/g;
  let match: RegExpExecArray | null;
  match = regex.exec(text);
  while (match !== null) {
    const candidate = match[1].trim();
    if (candidate.startsWith("=") && candidate.length > 2) {
      formulas.push(candidate);
    }
    match = regex.exec(text);
  }
  return [...new Set(formulas)]; // dedupe
}

export function FormulaPanel() {
  const { state, streamCompletion } = useChat();

  const [formula, setFormula] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appliedFormula, setAppliedFormula] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  const lastAddressRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const explainOnlyRef = useRef(false);

  const suggestedFormulas = useMemo(
    () =>
      loading || explainOnlyRef.current
        ? []
        : extractSuggestedFormulas(explanation),
    [explanation, loading],
  );

  const runExplanation = useCallback(
    async (addr: string, formulaStr: string, onlyExplain = false) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      explainOnlyRef.current = onlyExplain;

      setExplanation("");
      setLoading(true);
      if (!onlyExplain) {
        setAppliedFormula(null);
      }
      setApplyError(null);

      try {
        await streamCompletion(
          buildPrompt(addr, formulaStr, onlyExplain),
          (chunk) => setExplanation((prev) => prev + chunk),
          controller.signal,
        );
      } catch (_err) {
        if (!controller.signal.aborted) {
          setExplanation(
            "Error generating explanation. Check your API key in Settings.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [streamCompletion],
  );

  // Poll for selection changes
  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      try {
        const data = await getSelectedRangeData();
        if (!data || cancelled) return;

        const addr = data.address;
        const cellFormula = data.formulas?.[0]?.[0];
        const hasFormula =
          typeof cellFormula === "string" && cellFormula.startsWith("=");

        if (addr === lastAddressRef.current) return;
        lastAddressRef.current = addr;

        if (hasFormula) {
          setAddress(addr);
          setFormula(cellFormula);
          runExplanation(addr, cellFormula);
        } else {
          abortRef.current?.abort();
          abortRef.current = null;
          setAddress(null);
          setFormula(null);
          setExplanation("");
          setLoading(false);
        }
      } catch {
        // ignore
      }
    };

    poll();
    const id = setInterval(poll, 400);
    return () => {
      cancelled = true;
      clearInterval(id);
      abortRef.current?.abort();
    };
  }, [runExplanation]);

  const handleCopy = () => {
    if (formula) {
      navigator.clipboard.writeText(formula).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  const handleApply = useCallback(
    async (suggestedFormula: string) => {
      if (!address) return;
      setApplyError(null);
      try {
        await Excel.run(async (context) => {
          const range = context.workbook.getSelectedRange();
          range.formulas = [[suggestedFormula]];
          await context.sync();
        });
        setAppliedFormula(suggestedFormula);
        setFormula(suggestedFormula);
        // Re-explain the new formula without suggestions (explain-only)
        runExplanation(address, suggestedFormula, true);
      } catch (err) {
        console.error("[FormulaPanel] Apply failed:", err);
        setApplyError(
          err instanceof Error ? err.message : "Failed to apply formula",
        );
      }
    },
    [address, runExplanation],
  );

  if (!state.providerConfig) {
    return (
      <div
        className="flex-1 px-4 py-5"
        style={{ fontFamily: "var(--chat-font-sans)" }}
      >
        <p className="text-xs text-(--chat-text-muted)">
          Configure your API key in Settings to use Formula explanations.
        </p>
      </div>
    );
  }

  if (!formula) {
    return (
      <div
        className="flex-1 px-4 py-5"
        style={{ fontFamily: "var(--chat-font-sans)" }}
      >
        <div className="flex items-center gap-2 text-[13px] font-semibold text-(--chat-text-primary) mb-4">
          <FunctionSquare size={15} className="text-(--chat-accent)" />
          Formula Explainer
        </div>
        <p className="text-xs text-(--chat-text-muted) leading-relaxed">
          Select a cell with a formula to see an explanation.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-5 space-y-3.5"
      style={{ fontFamily: "var(--chat-font-sans)" }}
    >
      {/* Title */}
      <div className="flex items-center gap-2 text-[13px] font-semibold text-(--chat-text-primary)">
        <FunctionSquare size={15} className="text-(--chat-accent)" />
        Formula Explainer
      </div>

      {/* Active cell info card */}
      {address && (
        <div
          className="bg-(--chat-bg) border border-(--chat-border) shadow-xs px-3.5 py-3"
          style={{ borderRadius: "var(--chat-radius)" }}
        >
          <div className="text-[11px] text-(--chat-text-muted) font-medium mb-1">
            Active cell
          </div>
          <div className="text-xs font-semibold text-(--chat-accent)">
            {address}
          </div>
        </div>
      )}

      {/* Formula card */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-(--chat-text-secondary) font-medium">
            Formula
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 text-(--chat-text-muted) hover:text-(--chat-text-primary) transition-colors"
            title="Copy formula"
          >
            {copied ? (
              <span className="text-[10px] text-(--chat-accent)">Copied</span>
            ) : (
              <Copy size={11} />
            )}
          </button>
        </div>
        <div
          className="text-xs bg-(--chat-bg) border border-(--chat-border-active) px-3 py-2.5 text-(--chat-text-primary) break-all shadow-xs"
          style={{ borderRadius: "var(--chat-radius)" }}
        >
          {formula}
        </div>
      </div>

      {/* Explanation card */}
      <div
        className="bg-(--chat-bg) border border-(--chat-border) shadow-xs px-3.5 py-3"
        style={{ borderRadius: "var(--chat-radius)" }}
      >
        <div className="text-[11px] font-semibold text-(--chat-text-muted) uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles size={11} />
          Explanation
          {loading && (
            <span className="normal-case animate-pulse tracking-normal">
              ···
            </span>
          )}
        </div>
        {explanation ? (
          <div className="text-xs text-(--chat-text-primary) leading-relaxed markdown-content">
            <Streamdown plugins={{ code }} isAnimating={loading}>
              {explanation}
            </Streamdown>
          </div>
        ) : (
          <div className="text-xs text-(--chat-text-muted) animate-pulse">
            Analyzing formula…
          </div>
        )}
      </div>

      {/* Suggested formulas — apply buttons */}
      {suggestedFormulas.length > 0 && (
        <div
          className="bg-(--chat-bg) border border-(--chat-border) shadow-xs px-3.5 py-3"
          style={{ borderRadius: "var(--chat-radius)" }}
        >
          <div className="text-[11px] font-semibold text-(--chat-text-muted) uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ArrowUpRight size={11} />
            Suggested Formulas
          </div>
          <div className="space-y-2">
            {suggestedFormulas.map((sf) => (
              <div key={sf} className="flex items-center gap-2 text-xs">
                <div
                  className="flex-1 min-w-0 bg-(--chat-bg-tertiary) border border-(--chat-border) px-2.5 py-1.5 text-(--chat-text-primary) break-all"
                  style={{ borderRadius: "var(--chat-radius)" }}
                >
                  {sf}
                </div>
                <button
                  type="button"
                  onClick={() => handleApply(sf)}
                  disabled={appliedFormula === sf}
                  className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                    appliedFormula === sf
                      ? "text-green-500 bg-green-500/10 border border-green-500/30"
                      : "text-white bg-(--chat-accent) hover:opacity-90"
                  }`}
                  style={{ borderRadius: "var(--chat-radius)" }}
                  title={`Apply ${sf} to ${address}`}
                >
                  {appliedFormula === sf ? (
                    <>
                      <Check size={11} />
                      Applied
                    </>
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
            ))}
          </div>
          {applyError && (
            <div className="text-[10px] text-(--chat-error) mt-2">
              {applyError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
