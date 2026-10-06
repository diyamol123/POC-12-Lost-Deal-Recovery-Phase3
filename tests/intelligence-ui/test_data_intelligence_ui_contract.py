
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PAGE = (ROOT / "app/data-intelligence/page.tsx").read_text(encoding="utf-8")
FILTERS = (ROOT / "app/components/data-intelligence/IntelligenceFilters.tsx").read_text(
    encoding="utf-8"
)
METHODOLOGY = (
    ROOT / "app/components/data-intelligence/MethodologyPanel.tsx"
).read_text(encoding="utf-8")
LIMITATIONS = (
    ROOT / "app/components/data-intelligence/LimitationsPanel.tsx"
).read_text(encoding="utf-8")
STATE = (
    ROOT / "app/components/data-intelligence/IntelligenceStatePanel.tsx"
).read_text(encoding="utf-8")


def test_data_intelligence_route_contains_required_states_and_sections():
    assert "fetchIntelligenceStatus" in PAGE
    assert 'state === "stale"' in PAGE
    assert 'state === "error"' in PAGE
    assert 'state === "loading"' in PAGE
    assert "IntelligenceSummaryCards" in PAGE
    assert "IntelligenceFilters" in PAGE
    assert "ComparativeRanking" in PAGE
    assert "EvidencePanel" in PAGE
    assert "MethodologyPanel" in PAGE
    assert "LimitationsPanel" in PAGE


def test_filters_are_contract_derived_not_hard_coded_to_rank_values():
    assert "categories: string[]" in FILTERS
    assert "qualities: string[]" in FILTERS
    assert '["ALL", "rank_1", "rank_2", "rank_3", "rank_4", "rank_5"]' not in FILTERS


def test_methodology_uses_output_values_for_minimum_group_size():
    assert "summary.weak_case_review.minimum_size_cases" in METHODOLOGY
    assert " ? \"3\" :" not in METHODOLOGY


def test_limitations_only_render_approved_summary_limitations():
    assert "summary.important_limitations.map" in LIMITATIONS
    assert "recovery probability" not in LIMITATIONS
    assert "population-wide estimate or forecast" not in LIMITATIONS


def test_controlled_stale_state_withholds_results():
    assert "INTELLIGENCE DATA STALE" in STATE
    assert "withheld the affected analytical results" in STATE


def test_operational_page_source_is_not_modified_by_post4():
    operational = (ROOT / "app/page.tsx").read_text(encoding="utf-8")
    assert "LOST DEAL REASON & RECOVERY INTELLIGENCE" in operational
    assert "/api/deals" in operational
