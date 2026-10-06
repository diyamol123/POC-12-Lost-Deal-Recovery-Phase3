export type IntelligenceEvidence = {
  record_count: number;
  average_deal_value: number;
  contribution_pct: number;
  record_ids: string[];
};

export type IntelligenceResult = {
  result_id: string;
  result_type: string;
  record_id: string | null;
  entity_id: string | null;
  group_key: string;
  period_start: string | null;
  period_end: string | null;
  metric_name: string;
  result_value: number;
  result_unit: string;
  result_category: string;
  priority_rank: number;
  finding: string;
  evidence: IntelligenceEvidence;
  method_version: string;
  data_version: string;
  generated_at: string;
  quality_status: string;
  limitation: string;
};

export type IntelligenceSummary = {
  project_id: string;
  project_title: string;
  approved_track: string;
  primary_question: string;
  decision: string;
  data_version: string;
  method_version: string;
  result_count: number;
  key_findings: string[];
  priority_items: Array<{
    priority_rank: number;
    group_key: string;
    total_value: number;
    contribution_pct: number;
  }>;
  validation_result: {
    passed: boolean;
    contribution_total_percent: number;
    small_groups_at_threshold: string[];
  };
  weak_case_review: {
    minimum_size_cases: number;
    highest_value_record: {
      record_id: string;
      category: string;
      metric_value: number;
      assessment: string;
    };
  };
  important_limitations: string[];
  generated_at: string;
};

export type IntelligenceMetadata = {
  data_version: string;
  method_version: string;
  generated_at: string;
  quality_status: string;
  approved_track: string;
  source: string;
};

export type IntelligenceResponse = {
  metadata: IntelligenceMetadata;
  items: IntelligenceResult[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
};

export type IntelligencePackage = {
  metadata: IntelligenceMetadata;
  summary: IntelligenceSummary;
  results: IntelligenceResult[];
  validation: {
    approved_track: string;
    data_version: string;
    method_version: string;
    validation_result: string;
    passed: boolean;
    record_count: number;
    primary_group_count: number;
    minimum_group_size: number;
    contribution_total_percent: number;
    small_groups_at_threshold: string[];
  };
};


export type IntelligenceStatus = {
  status: "validated" | "stale" | "error";
  quality_status?: string;
  data_version?: string;
  method_version?: string;
  generated_at?: string;
  approved_track?: string;
  detail?: string;
};
