
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OPERATIONAL = ROOT / "app/page.tsx"


def test_operational_page_is_present_and_unchanged_in_source_tree():
    source = OPERATIONAL.read_text(encoding="utf-8")

    assert "LOST DEAL REASON & RECOVERY INTELLIGENCE" in source
    assert "/api/deals" in source
    assert "DashboardCharts" in source
    assert "RecoveryTable" in source
    assert "DecisionPanel" in source
    assert "locationFilter" in source
    assert "reasonFilter" in source
    assert "priorityFilter" in source


def test_post4_adds_a_separate_route():
    route = ROOT / "app/data-intelligence/page.tsx"
    assert route.exists()
    assert route != OPERATIONAL
