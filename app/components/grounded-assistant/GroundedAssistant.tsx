"use client";

import { useState } from "react";
import {
  askGroundedAssistant,
  type AssistantResponse,
} from "@/app/services/assistantService";

const SUGGESTED_QUESTIONS = [
  "Which lost-deal category has the highest total deal value?",
  "What are the top 3 lost-deal categories by total deal value?",
  "What is the ranking of Price?",
  "Why is Price ranked at its current position?",
  "What evidence supports Price?",
  "Compare Price and Competitor",
  "What limitations apply to this analysis?",
  "What data and method versions are currently being used?",
  "What is the validation status of the intelligence package?",
];

function formatValue(value: unknown): string {
  if (typeof value === "number") {
    return value.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value === null || value === undefined) {
    return "—";
  }

  return String(value);
}

function getAnswer(response: AssistantResponse): string {
  const result = response.result;

  if (response.intent === "top_category" && result) {
    return `${result.group_key} ranks #${result.priority_rank} with a total deal value of ${formatValue(result.result_value)}.`;
  }

  if (response.intent === "category_rank" && result) {
    return `${result.group_key} is ranked #${result.priority_rank} by total deal value.`;
  }

  if (response.intent === "category_explanation" && result) {
    return `${result.group_key} is ranked #${result.priority_rank} because it has a total deal value of ${formatValue(result.result_value)}, contributing ${formatValue(result.contribution_pct)}% of the observed total across ${formatValue(result.record_count)} records.`;
  }

  if (response.intent === "category_evidence" && result) {
    return `The approved evidence for ${result.group_key} contains ${formatValue(response.evidence[0]?.record_count)} records and a ${formatValue(response.evidence[0]?.contribution_pct)}% contribution to the observed total.`;
  }

  if (response.intent === "top_categories" && response.results) {
    return response.results
      .map(
        (item) =>
          `#${item.priority_rank} ${item.group_key} — ${formatValue(item.result_value)}`
      )
      .join(" · ");
  }

  if (response.intent === "compare_categories" && response.results) {
    return response.results
      .map(
        (item) =>
          `#${item.priority_rank} ${item.group_key} — ${formatValue(item.result_value)}`
      )
      .join(" · ");
  }

  if (response.intent === "analysis_limitations") {
    return response.results?.join(" ") || response.limitation;
  }

  if (response.intent === "package_versions" && result) {
    return `Data ${result.data_version} · Method ${result.method_version} · Quality ${result.quality_status}.`;
  }

  if (response.intent === "validation_status" && result) {
    return `Validation: ${result.validation_result}. Record count: ${formatValue(result.record_count)}. Contribution total: ${formatValue(result.contribution_total_percent)}%.`;
  }

  return "A grounded result was returned from the approved intelligence package.";
}

export default function GroundedAssistant() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (value = question) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setError("Please enter a question.");
      return;
    }

    setQuestion(trimmed);
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const result = await askGroundedAssistant(trimmed);
      setResponse(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to answer the question."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="grounded-assistant-title"
      className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="grounded-assistant-title"
            className="text-sm font-semibold tracking-wide text-slate-100"
          >
            GROUNDED DATA ASSISTANT
          </h2>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
            Ask a supported question about the approved intelligence package.
            Answers are retrieved deterministically from validated Track A results. Gemini only explains the validated result and evidence.
          </p>
        </div>

        <span className="rounded-full border border-[#38BDF8]/20 px-2.5 py-1 text-[9px] uppercase tracking-wider text-[#38BDF8]">
          Deterministic Retrieval · Gemini Explanation
        </span>
      </div>

      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <label htmlFor="assistant-question" className="sr-only">
          Ask a supported intelligence question
        </label>

        <input
          id="assistant-question"
          value={question}
          maxLength={500}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about lost-deal categories, rankings, evidence, or limitations..."
          className="min-w-0 flex-1 rounded-lg border border-[#1F2937] bg-[#030712] px-3 py-2.5 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-[#38BDF8]/40"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg border border-[#38BDF8]/30 px-4 py-2.5 text-xs font-medium text-[#38BDF8] hover:bg-[#38BDF8]/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Checking..." : "Ask"}
        </button>
      </form>

      <div className="mt-4">
        <div className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
          Suggested questions
        </div>

        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void submit(suggestion)}
              disabled={loading}
              className="rounded-lg border border-[#1F2937] px-2.5 py-1.5 text-left text-[10px] text-slate-400 hover:border-[#38BDF8]/30 hover:text-[#38BDF8] disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-900/50 bg-red-950/20 p-3 text-xs text-red-300"
        >
          {error}
        </div>
      )}

      {response && !error && (
        <div className="mt-5 space-y-4 rounded-xl border border-[#1F2937] bg-[#030712] p-4">
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-wider text-[#38BDF8]">
              Grounded answer
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              {getAnswer(response)}
            </p>
          </div>

          {response.gemini_explanation && (
            <div className="rounded-lg border border-[#818CF8]/20 bg-[#818CF8]/5 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[9px] font-semibold uppercase tracking-wider text-[#818CF8]">
                  Gemini explanation
                </div>
                <span className="text-[9px] uppercase tracking-wider text-slate-600">
                  {response.explanation_status === "AVAILABLE"
                    ? "Grounded"
                    : "Fallback"}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-300">
                {response.gemini_explanation}
              </p>
            </div>
          )}

          {response.evidence.length > 0 && (
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                Evidence
              </div>
              <div className="mt-2 space-y-1 text-xs text-slate-400">
                {response.evidence.map((evidence) => (
                  <div key={evidence.reference || "evidence"}>
                    {evidence.reference || "Approved result"} ·{" "}
                    {formatValue(evidence.record_count)} records ·{" "}
                    {formatValue(evidence.contribution_pct)}% contribution
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-2 text-[10px] text-slate-500 sm:grid-cols-3">
            <div>
              <span className="text-slate-600">Data version</span>
              <div className="mt-1 text-slate-300">
                {response.metadata.data_version}
              </div>
            </div>
            <div>
              <span className="text-slate-600">Method version</span>
              <div className="mt-1 text-slate-300">
                {response.metadata.method_version}
              </div>
            </div>
            <div>
              <span className="text-slate-600">Quality</span>
              <div className="mt-1 text-slate-300">
                {response.metadata.quality_status}
              </div>
            </div>
          </div>

          <div className="border-t border-[#1F2937] pt-3">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
              Limitation
            </div>
            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              {response.limitation}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
