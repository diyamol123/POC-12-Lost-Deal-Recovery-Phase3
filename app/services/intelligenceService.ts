
import type {
  IntelligencePackage,
  IntelligenceResponse,
  IntelligenceStatus,
  IntelligenceSummary,
} from "@/app/types/intelligence";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Intelligence API request failed: ${response.status}${detail ? ` — ${detail}` : ""}`
    );
  }

  return response.json() as Promise<T>;
}

export function fetchIntelligenceStatus(): Promise<IntelligenceStatus> {
  return request<IntelligenceStatus>("/api/intelligence/status");
}

export function fetchIntelligencePackage(): Promise<IntelligencePackage> {
  return Promise.all([
    request<IntelligenceSummary>("/api/intelligence/summary"),
    request<IntelligenceResponse>(
      "/api/intelligence/results?page=1&page_size=100"
    ),
    request<{
      metadata: IntelligencePackage["metadata"];
      validation: IntelligencePackage["validation"];
    }>("/api/intelligence/metadata"),
  ]).then(([summary, results, metadata]) => ({
    metadata: metadata.metadata,
    summary,
    results: results.items,
    validation: metadata.validation,
  }));
}

export function fetchIntelligenceResults(
  params: URLSearchParams
): Promise<IntelligenceResponse> {
  const query = params.toString();
  return request<IntelligenceResponse>(
    `/api/intelligence/results${query ? `?${query}` : ""}`
  );
}
