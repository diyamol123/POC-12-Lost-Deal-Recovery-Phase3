export type PortfolioRecord = {
  record_id: string;
  record_type: string;
  observed_at: string;
  entity_id: string;
  related_entity_id: string;
  entity_name: string;
  category: string;
  subcategory: string;
  status: string;
  stage: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  text_value: string;
  latitude: string;
  longitude: string;
  source_name: string;
  source_record_id: string;
  is_synthetic: boolean;
  data_version: string;
};

export type PortfolioGroup = {
  group_key: string;
  record_count: number;
  total_value: number;
  average_value: number;
  contribution_pct: number;
  priority_rank: number;
  baseline_comparison: string;
  record_ids: string[];
};

export function formatRawUnits(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact", compactDisplay: "short", maximumFractionDigits: 1,
  }).format(value);
}

export function sumMetric(records: PortfolioRecord[]): number {
  return records.reduce((sum, record) => sum + (record.metric_value || 0), 0);
}
