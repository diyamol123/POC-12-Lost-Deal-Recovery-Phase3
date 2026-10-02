# Data Source Inventory

## Phase 3 Canonical Data Foundation

### Source 1 — Phase 2 Backend Synthetic CRM Dataset

- **Source location:** `backend/main.py`
- **Source structure:** Hardcoded `deals` list
- **Source endpoint:** `/api/deals`
- **Record count:** 20
- **Source fields:** 13
- **Record ID range:** CRM-001 to CRM-020
- **Date range:** 2026-01-08 to 2026-06-05
- **Data type:** Synthetic CRM lost-deal records
- **External API required:** No
- **Database required:** No
- **Separate CSV/Excel source supplied:** No

### Current Data-Loading Flow

```text
backend/main.py
      ↓
hardcoded synthetic `deals` list
      ↓
GET /api/deals
      ↓
frontend consumes deal records
```

### Source Fields

The Phase 2 source contains:

id
date
location
team
product
company
segment
reason
competitor
stage
value
priority
action

### Sensitive-Data Assessment

The supplied 20 records contain no visible:

- personal names
- email addresses
- telephone numbers
- passwords
- authentication credentials
- API keys
- direct personal identifiers

The records contain company names and business-deal information.

### Synthetic-Data Assessment

The Phase 2 application identifies the CRM records as synthetic where operational data is unavailable. Therefore all canonical records are marked:

is_synthetic = true

### Sampling Decision

No reduction was required.

All 20 available source records are retained because the complete supplied dataset is already well below the Phase 3 sampling limits and retaining all records preserves the available categories, stages, dates, and business cases.

No `head()`-based sampling was used.

### Data-Source Limitation

No separate production CRM export, CSV, Excel file, database dump, or external API dataset was supplied for Phase 3.

Therefore the canonical package is based only on the supplied Phase 2 synthetic CRM dataset.
