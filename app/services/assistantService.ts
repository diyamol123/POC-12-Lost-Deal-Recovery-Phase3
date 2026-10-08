export interface AssistantEvidence {
  record_count?: number;
  average_deal_value?: number;
  contribution_pct?: number;
  record_ids?: string[];
  reference?: string;
}

export interface AssistantResponse {
  intent: string;
  parameters: Record<string, unknown>;
  result?: Record<string, unknown>;
  results?: Record<string, unknown>[];
  evidence: AssistantEvidence[];
  metadata: {
    data_version: string;
    method_version: string;
    generated_at: string;
    quality_status: string;
    approved_track: string;
  };
  limitation: string;

  gemini_explanation?: string;

  explanation_status?: "AVAILABLE" | "UNAVAILABLE";
  scope_status: string;
  confidence: string;
}

export async function askGroundedAssistant(
  question: string
): Promise<AssistantResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const response = await fetch(`${baseUrl}/api/assistant/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof payload?.detail === "string"
        ? payload.detail
        : "Unable to answer the question."
    );
  }

  return payload as AssistantResponse;
}
