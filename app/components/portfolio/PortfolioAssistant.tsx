"use client";

import { useState } from "react";
import { Bot, Send, Loader2, ShieldCheck } from "lucide-react";

type AssistantResponse = {
  status?: string;
  intent?: string;
  answer?: string;
  gemini_explanation?: string;
  explanation_status?: string;
  evidence_references?: string[];
  limitation?: string;
  metadata?: {
    data_version?: string;
    method_version?: string;
    baseline_record_count?: number;
  };
};

const PROMPTS = [
  "Which category ranks highest?",
  "Compare Timing and Budget categories",
  "What is the ranking and evidence for Price?",
  "What is the overall portfolio baseline?",
];

export default function PortfolioAssistant() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(value = question) {
    const clean = value.trim();
    if (!clean || loading) return;
    setQuestion(clean);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${base}/api/portfolio/assistant/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: clean }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || `Request failed (${response.status})`);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reach the portfolio assistant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-5 rounded-2xl border border-[#dce5f4] bg-white p-4 shadow-[0_2px_12px_rgba(20,33,61,0.04)] sm:p-6">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-[#eaf0ff] p-2.5 text-[#3659c9]"><Bot size={22} /></span>
        <div>
          <h2 className="text-base font-semibold text-[#172033]">Portfolio Intelligence Assistant</h2>
          <p className="mt-1 text-xs text-[#718096]">Ask questions about the 500-record synthetic experiment.</p>
        </div>
        <span className="ml-auto rounded-full bg-[#edf8f1] px-2.5 py-1 text-[10px] font-semibold text-[#247447]">Grounded assistant</span>
      </div>

      <form className="mt-5 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); void ask(); }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about rankings, categories, evidence or baseline..."
          className="h-11 min-w-0 flex-1 rounded-xl border border-[#dce3ef] px-4 text-sm outline-none focus:border-[#5275d8] focus:ring-2 focus:ring-[#5275d8]/15"
          maxLength={500}
        />
        <button disabled={loading || !question.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3659c9] px-5 text-sm font-semibold text-white hover:bg-[#294bb3] disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Ask assistant
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {PROMPTS.map((prompt) => (
          <button key={prompt} type="button" disabled={loading} onClick={() => { setQuestion(prompt); void ask(prompt); }}
            className="rounded-lg border border-[#e1e7f0] bg-[#f8faff] px-3 py-2 text-xs text-[#526174] hover:border-[#9db1e8] hover:text-[#294db8] disabled:opacity-50">
            {prompt}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {result && (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-[#dce5f4] bg-[#f8faff] p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">Deterministic result</span>
              <span className="rounded-full bg-[#e8efff] px-2 py-0.5 text-[10px] font-semibold text-[#3659c9]">{result.status || "Response"}</span>
              {result.intent && <span className="text-[10px] text-[#8490a3]">{result.intent.replaceAll("_", " ")}</span>}
            </div>
            <p className="whitespace-pre-line text-sm leading-7 text-[#26354d]">{result.answer || "No answer returned."}</p>
          </div>

          {result.gemini_explanation && (
            <div className="rounded-xl border border-[#e2e8f2] p-4">
              <div className="mb-2 flex items-center gap-2">
                <Bot size={16} className="text-[#3659c9]" />
                <h3 className="text-sm font-semibold text-[#172033]">AI explanation</h3>
                <span className="ml-auto text-[10px] font-semibold text-[#247447]">{result.explanation_status || "AVAILABLE"}</span>
              </div>
              <p className="whitespace-pre-line text-sm leading-7 text-[#526174]">{result.gemini_explanation}</p>
            </div>
          )}

          {result.evidence_references?.length ? (
            <div className="rounded-xl border border-[#e2e8f2] p-4">
              <h3 className="mb-2 text-xs font-semibold text-[#334155]">Evidence references</h3>
              <ul className="space-y-1">
                {result.evidence_references.map((ref) => <li key={ref} className="text-xs text-[#64748b]">• {ref}</li>)}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#8490a3]">
            <ShieldCheck size={13} />
            {result.metadata?.data_version || "portfolio-synth-v1.0.0"} · Method {result.metadata?.method_version || "1.0.0"}
            {result.metadata?.baseline_record_count ? ` · ${result.metadata.baseline_record_count} baseline records` : ""}
          </div>
          {result.limitation && <p className="border-t border-[#edf1f6] pt-3 text-[11px] leading-5 text-[#8490a3]">{result.limitation}</p>}
        </div>
      )}
    </section>
  );
}
