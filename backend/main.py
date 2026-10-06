from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Deal(BaseModel):
    id: str
    date: str
    location: str
    team: str
    product: str
    company: str
    segment: str
    reason: str
    competitor: str
    stage: str
    value: int
    priority: str
    action: str


app = FastAPI(
    title="Lost Deal Recovery API",
    description="FastAPI backend for the Lost Deal Reason & Recovery Intelligence dashboard.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


deals = [
    {
        "id": "CRM-001",
        "date": "2026-01-08",
        "location": "Bengaluru",
        "team": "Enterprise",
        "product": "Analytics Suite",
        "company": "Aster Systems",
        "segment": "Enterprise",
        "reason": "Price",
        "competitor": "Salesforce",
        "stage": "Negotiation",
        "value": 850000,
        "priority": "HIGH",
        "action": "Re-engage with ROI comparison and flexible pricing.",
    },
    {
        "id": "CRM-002",
        "date": "2026-01-14",
        "location": "Mumbai",
        "team": "Enterprise",
        "product": "Cloud Platform",
        "company": "Nova Retail",
        "segment": "Enterprise",
        "reason": "Competitor",
        "competitor": "Microsoft",
        "stage": "Proposal",
        "value": 720000,
        "priority": "HIGH",
        "action": "Review competitor feature gap and schedule executive follow-up.",
    },
    {
        "id": "CRM-003",
        "date": "2026-01-22",
        "location": "Kochi",
        "team": "SMB",
        "product": "Analytics Suite",
        "company": "Bluewave Foods",
        "segment": "SMB",
        "reason": "Product Fit",
        "competitor": "Zoho",
        "stage": "Evaluation",
        "value": 280000,
        "priority": "MEDIUM",
        "action": "Offer a product-fit workshop and targeted demo.",
    },
    {
        "id": "CRM-004",
        "date": "2026-02-03",
        "location": "Chennai",
        "team": "Mid-Market",
        "product": "CRM Platform",
        "company": "Orbit Logistics",
        "segment": "Mid-Market",
        "reason": "Timing",
        "competitor": "HubSpot",
        "stage": "Proposal",
        "value": 460000,
        "priority": "MEDIUM",
        "action": "Create a 60-day re-engagement reminder.",
    },
    {
        "id": "CRM-005",
        "date": "2026-02-11",
        "location": "Hyderabad",
        "team": "Enterprise",
        "product": "Cloud Platform",
        "company": "Vertex Health",
        "segment": "Enterprise",
        "reason": "Price",
        "competitor": "AWS",
        "stage": "Negotiation",
        "value": 1100000,
        "priority": "HIGH",
        "action": "Escalate for commercial review and ROI justification.",
    },
    {
        "id": "CRM-006",
        "date": "2026-02-18",
        "location": "Pune",
        "team": "SMB",
        "product": "CRM Platform",
        "company": "Bright Retail",
        "segment": "SMB",
        "reason": "Budget",
        "competitor": "Zoho",
        "stage": "Qualification",
        "value": 190000,
        "priority": "LOW",
        "action": "Revisit during next budget cycle.",
    },
    {
        "id": "CRM-007",
        "date": "2026-02-26",
        "location": "Delhi",
        "team": "Mid-Market",
        "product": "Analytics Suite",
        "company": "Northstar Finance",
        "segment": "Mid-Market",
        "reason": "Competitor",
        "competitor": "Power BI",
        "stage": "Negotiation",
        "value": 640000,
        "priority": "HIGH",
        "action": "Compare analytics capabilities and migration benefits.",
    },
    {
        "id": "CRM-008",
        "date": "2026-03-04",
        "location": "Kochi",
        "team": "SMB",
        "product": "Cloud Platform",
        "company": "Harbor Tech",
        "segment": "SMB",
        "reason": "Product Fit",
        "competitor": "AWS",
        "stage": "Evaluation",
        "value": 230000,
        "priority": "MEDIUM",
        "action": "Run a technical discovery session.",
    },
    {
        "id": "CRM-009",
        "date": "2026-03-12",
        "location": "Bengaluru",
        "team": "Enterprise",
        "product": "CRM Platform",
        "company": "Zenith Motors",
        "segment": "Enterprise",
        "reason": "Competitor",
        "competitor": "Salesforce",
        "stage": "Proposal",
        "value": 920000,
        "priority": "HIGH",
        "action": "Build competitor battlecard and executive outreach.",
    },
    {
        "id": "CRM-010",
        "date": "2026-03-18",
        "location": "Mumbai",
        "team": "Mid-Market",
        "product": "Analytics Suite",
        "company": "Urban Living",
        "segment": "Mid-Market",
        "reason": "Timing",
        "competitor": "Tableau",
        "stage": "Evaluation",
        "value": 370000,
        "priority": "MEDIUM",
        "action": "Schedule future re-engagement based on buying cycle.",
    },
    {
        "id": "CRM-011",
        "date": "2026-03-25",
        "location": "Chennai",
        "team": "SMB",
        "product": "CRM Platform",
        "company": "Green Basket",
        "segment": "SMB",
        "reason": "Budget",
        "competitor": "Zoho",
        "stage": "Qualification",
        "value": 150000,
        "priority": "LOW",
        "action": "Send lower-tier package when budget becomes available.",
    },
    {
        "id": "CRM-012",
        "date": "2026-04-02",
        "location": "Hyderabad",
        "team": "Enterprise",
        "product": "Cloud Platform",
        "company": "Prime Energy",
        "segment": "Enterprise",
        "reason": "Price",
        "competitor": "Azure",
        "stage": "Negotiation",
        "value": 1250000,
        "priority": "HIGH",
        "action": "Conduct executive pricing review and ROI analysis.",
    },
    {
        "id": "CRM-013",
        "date": "2026-04-10",
        "location": "Pune",
        "team": "Mid-Market",
        "product": "CRM Platform",
        "company": "Axis Manufacturing",
        "segment": "Mid-Market",
        "reason": "Product Fit",
        "competitor": "HubSpot",
        "stage": "Evaluation",
        "value": 410000,
        "priority": "MEDIUM",
        "action": "Map missing requirements and propose configuration.",
    },
    {
        "id": "CRM-014",
        "date": "2026-04-18",
        "location": "Delhi",
        "team": "Enterprise",
        "product": "Analytics Suite",
        "company": "Summit Bank",
        "segment": "Enterprise",
        "reason": "Competitor",
        "competitor": "Tableau",
        "stage": "Negotiation",
        "value": 980000,
        "priority": "HIGH",
        "action": "Present differentiated analytics capabilities.",
    },
    {
        "id": "CRM-015",
        "date": "2026-04-25",
        "location": "Kochi",
        "team": "SMB",
        "product": "Cloud Platform",
        "company": "Coastal Foods",
        "segment": "SMB",
        "reason": "Timing",
        "competitor": "AWS",
        "stage": "Proposal",
        "value": 210000,
        "priority": "LOW",
        "action": "Place into quarterly recovery campaign.",
    },
    {
        "id": "CRM-016",
        "date": "2026-05-03",
        "location": "Bengaluru",
        "team": "Mid-Market",
        "product": "CRM Platform",
        "company": "Techline India",
        "segment": "Mid-Market",
        "reason": "Price",
        "competitor": "Salesforce",
        "stage": "Proposal",
        "value": 570000,
        "priority": "HIGH",
        "action": "Reopen pricing discussion with value-based package.",
    },
    {
        "id": "CRM-017",
        "date": "2026-05-11",
        "location": "Mumbai",
        "team": "Enterprise",
        "product": "Cloud Platform",
        "company": "Metro Infra",
        "segment": "Enterprise",
        "reason": "Budget",
        "competitor": "Azure",
        "stage": "Qualification",
        "value": 690000,
        "priority": "MEDIUM",
        "action": "Monitor budget approval and prepare re-entry plan.",
    },
    {
        "id": "CRM-018",
        "date": "2026-05-19",
        "location": "Chennai",
        "team": "SMB",
        "product": "Analytics Suite",
        "company": "FreshMart",
        "segment": "SMB",
        "reason": "Competitor",
        "competitor": "Power BI",
        "stage": "Evaluation",
        "value": 175000,
        "priority": "LOW",
        "action": "Share product comparison and customer proof points.",
    },
    {
        "id": "CRM-019",
        "date": "2026-05-27",
        "location": "Hyderabad",
        "team": "Mid-Market",
        "product": "CRM Platform",
        "company": "Medix Labs",
        "segment": "Mid-Market",
        "reason": "Product Fit",
        "competitor": "HubSpot",
        "stage": "Proposal",
        "value": 520000,
        "priority": "MEDIUM",
        "action": "Schedule solution-design workshop.",
    },
    {
        "id": "CRM-020",
        "date": "2026-06-05",
        "location": "Pune",
        "team": "Enterprise",
        "product": "Analytics Suite",
        "company": "Global Textiles",
        "segment": "Enterprise",
        "reason": "Price",
        "competitor": "Tableau",
        "stage": "Negotiation",
        "value": 890000,
        "priority": "HIGH",
        "action": "Create executive-level commercial recovery plan.",
    },
]


@app.get("/")
def root():
    return {
        "message": "Lost Deal Recovery API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/api/deals", response_model=list[Deal])
def get_deals():
    return deals

# ---------------- PHASE 3 POST #4: DATA INTELLIGENCE ----------------

from pathlib import Path as _Path
from datetime import datetime as _Datetime
import json as _json

_INTELLIGENCE_ROOT = _Path(__file__).resolve().parents[1] / "data-science" / "outputs"
_RESULTS_FILE = _INTELLIGENCE_ROOT / "intelligence_results.json"
_SUMMARY_FILE = _INTELLIGENCE_ROOT / "intelligence_summary.json"
_VALIDATION_FILE = _INTELLIGENCE_ROOT / "validation_metrics.json"

_APPROVED_TRACK = "Track A — Comparative Intelligence"
_ALLOWED_SORT = {"priority_rank", "result_value", "group_key"}
_STALE_MARKERS = (
    "Version mismatch",
    "data_version mismatch",
    "method_version mismatch",
    "quality status",
    "Validation package is not approved",
    "Validation output is not approved",
    "Generated timestamp mismatch",
    "generated_at mismatch",
    "Unsupported quality status",
)


def _load_intelligence_package():
    try:
        results = _json.loads(_RESULTS_FILE.read_text(encoding="utf-8"))
        summary = _json.loads(_SUMMARY_FILE.read_text(encoding="utf-8"))
        validation = _json.loads(_VALIDATION_FILE.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"Missing approved intelligence output: {exc.filename}") from exc
    except _json.JSONDecodeError as exc:
        raise ValueError(f"Invalid intelligence JSON: {exc}") from exc

    if not isinstance(results, list):
        raise ValueError("intelligence_results.json must contain a list")

    if not isinstance(summary, dict) or not isinstance(validation, dict):
        raise ValueError("Summary and validation outputs must be JSON objects")

    if summary.get("result_count") != len(results):
        raise ValueError("Summary result_count does not match result package")

    if summary.get("data_version") != validation.get("data_version"):
        raise ValueError("Summary and validation data_version mismatch")

    if summary.get("method_version") != validation.get("method_version"):
        raise ValueError("Summary and validation method_version mismatch")

    if validation.get("validation_result") != "PASS" or validation.get("passed") is not True:
        raise ValueError("Validation package is not approved")

    if summary.get("approved_track") != _APPROVED_TRACK:
        raise ValueError("Unsupported analytical track")

    if summary.get("generated_at") is None:
        raise ValueError("Summary generated_at is missing")

    required = {
        "result_id", "result_type", "record_id", "entity_id", "group_key",
        "period_start", "period_end", "metric_name", "result_value",
        "result_unit", "result_category", "priority_rank", "finding",
        "evidence", "method_version", "data_version", "generated_at",
        "quality_status", "limitation"
    }

    ids = set()

    for item in results:
        missing = required - item.keys()

        if missing:
            raise ValueError(
                f"Missing intelligence result fields: {sorted(missing)}"
            )

        result_id = item["result_id"]

        if result_id in ids:
            raise ValueError(f"Duplicate result_id: {result_id}")

        ids.add(result_id)

        if (
            item["data_version"] != summary["data_version"]
            or item["method_version"] != summary["method_version"]
        ):
            raise ValueError(f"Version mismatch for {result_id}")

        if item["generated_at"] != summary["generated_at"]:
            raise ValueError(f"Generated timestamp mismatch for {result_id}")

        if item["quality_status"] != "validated":
            raise ValueError(f"Unsupported quality status for {result_id}")

        if (
            item["metric_name"] != "total_deal_value"
            or isinstance(item["result_value"], bool)
            or not isinstance(item["result_value"], (int, float))
        ):
            raise ValueError(f"Invalid metric contract for {result_id}")

        evidence = item.get("evidence")

        if not isinstance(evidence, dict):
            raise ValueError(f"Invalid evidence object for {result_id}")

        for key in (
            "record_count",
            "average_deal_value",
            "contribution_pct",
            "record_ids",
        ):
            if key not in evidence:
                raise ValueError(f"Missing evidence field {key} for {result_id}")

        try:
            _Datetime.fromisoformat(
                item["generated_at"].replace("Z", "+00:00")
            )
        except ValueError as exc:
            raise ValueError(
                f"Invalid generated_at for {result_id}"
            ) from exc

    return results, summary, validation


def _load_intelligence_package_or_http():
    try:
        return _load_intelligence_package()
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


def _intelligence_metadata(summary, validation):
    return {
        "data_version": summary["data_version"],
        "method_version": summary["method_version"],
        "generated_at": summary["generated_at"],
        "quality_status": "validated" if validation.get("passed") else "invalid",
        "approved_track": summary["approved_track"],
        "source": (
            "data-science/outputs/intelligence_results.json + "
            "intelligence_summary.json"
        ),
    }


def _intelligence_status():
    try:
        results, summary, validation = _load_intelligence_package()
        metadata = _intelligence_metadata(summary, validation)

        return {
            "status": "validated",
            **metadata,
            "result_count": len(results),
        }
    except ValueError as exc:
        detail = str(exc)
        status = (
            "stale"
            if any(marker in detail for marker in _STALE_MARKERS)
            else "error"
        )

        return {
            "status": status,
            "detail": detail,
        }


@app.get("/api/intelligence/health")
def intelligence_health():
    status = _intelligence_status()

    if status["status"] == "validated":
        return {
            "status": "ok",
            "quality_status": "validated",
        }

    return {
        "status": status["status"],
        "detail": status.get("detail"),
    }


@app.get("/api/intelligence/status")
def intelligence_status():
    return _intelligence_status()


@app.get("/api/intelligence/metadata")
def intelligence_metadata():
    results, summary, validation = _load_intelligence_package_or_http()

    return {
        "metadata": _intelligence_metadata(summary, validation),
        "validation": validation,
        "result_count": len(results),
    }


@app.get("/api/intelligence/summary")
def intelligence_summary():
    _, summary, _ = _load_intelligence_package_or_http()
    return summary


@app.get("/api/intelligence/results")
def intelligence_results(
    result_type: str | None = None,
    result_category: str | None = None,
    group_key: str | None = None,
    quality_status: str | None = None,
    page: int = 1,
    page_size: int = 25,
    sort_by: str = "priority_rank",
    sort_order: str = "asc",
):
    if page < 1:
        raise HTTPException(status_code=400, detail="page must be >= 1")

    if page_size < 1 or page_size > 100:
        raise HTTPException(
            status_code=400,
            detail="page_size must be between 1 and 100",
        )

    if sort_by not in _ALLOWED_SORT:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported sort_by: {sort_by}",
        )

    if sort_order not in {"asc", "desc"}:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported sort_order: {sort_order}",
        )

    results, summary, validation = _load_intelligence_package_or_http()

    if result_type:
        results = [r for r in results if r["result_type"] == result_type]

    if result_category:
        results = [r for r in results if r["result_category"] == result_category]

    if group_key:
        results = [r for r in results if r["group_key"] == group_key]

    if quality_status:
        results = [r for r in results if r["quality_status"] == quality_status]

    results = sorted(
        results,
        key=lambda r: r[sort_by],
        reverse=sort_order == "desc",
    )

    total = len(results)
    start = (page - 1) * page_size
    end = start + page_size

    return {
        "metadata": _intelligence_metadata(summary, validation),
        "items": results[start:end],
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_items": total,
            "total_pages": (total + page_size - 1) // page_size,
        },
    }


@app.get("/api/intelligence/results/{result_id}")
def intelligence_result(result_id: str):
    results, _, _ = _load_intelligence_package_or_http()

    for result in results:
        if result["result_id"] == result_id:
            return result

    raise HTTPException(
        status_code=404,
        detail="Intelligence result not found",
    )
