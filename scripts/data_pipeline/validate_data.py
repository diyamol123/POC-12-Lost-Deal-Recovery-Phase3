import csv
import json
import re
from pathlib import Path

DATA_DIR = Path("data")
SOURCE = DATA_DIR / "source-sample/source_sample.csv"
CANONICAL = DATA_DIR / "canonical/intelligence_data.csv"
PUBLISHED = DATA_DIR / "published/intelligence_data.json"
SCHEMA = DATA_DIR / "schema.json"
MANIFEST = DATA_DIR / "manifest.json"
REPORT = DATA_DIR / "quality/validation_report.json"

EXPECTED_COLUMNS = [
    "record_id",
    "record_type",
    "observed_at",
    "entity_id",
    "related_entity_id",
    "entity_name",
    "category",
    "subcategory",
    "status",
    "stage",
    "metric_name",
    "metric_value",
    "metric_unit",
    "text_value",
    "latitude",
    "longitude",
    "source_name",
    "source_record_id",
    "is_synthetic",
    "data_version",
]

REQUIRED_FIELDS = [
    "record_id",
    "record_type",
    "observed_at",
    "entity_id",
    "entity_name",
    "category",
    "subcategory",
    "status",
    "stage",
    "metric_name",
    "metric_value",
    "metric_unit",
    "source_name",
    "source_record_id",
    "is_synthetic",
    "data_version",
]

MAX_ROWS = 10_000
MAX_COLS = 50
MAX_DATA_FILE_BYTES = 5 * 1024 * 1024
MAX_DATA_DIR_BYTES = 10 * 1024 * 1024
MAX_TEXT_LENGTH = 500

RESTRICTED_PATTERNS = [
    r"\bpassword\b",
    r"\bpasswd\b",
    r"\bsecret\b",
    r"\bapi[_ -]?key\b",
    r"\baccess[_ -]?token\b",
    r"\bauth[_ -]?token\b",
    r"\bssn\b",
    r"\bsocial security\b",
]

EMAIL_PATTERN = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I)
PHONE_PATTERN = re.compile(r"(?<!\d)(?:\+?\d[\d\s().-]{7,}\d)(?!\d)")


def check(condition, message, failures):
    if not condition:
        failures.append(message)


def file_size(path):
    return path.stat().st_size


def main():
    failures = []
    checks = []

    # Required files
    required_files = [
        SOURCE,
        CANONICAL,
        PUBLISHED,
        SCHEMA,
        MANIFEST,
    ]

    for path in required_files:
        exists = path.exists()
        checks.append({
            "check": f"required_file:{path}",
            "status": "passed" if exists else "failed"
        })
        check(exists, f"Missing required file: {path}", failures)

    if failures:
        report = {
            "status": "FAILED",
            "failures": failures,
            "checks": checks,
        }
        REPORT.parent.mkdir(parents=True, exist_ok=True)
        REPORT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
        print("VALIDATION FAILED")
        for failure in failures:
            print(f"- {failure}")
        raise SystemExit(1)

    # File size limits
    for path in required_files:
        size_ok = file_size(path) <= MAX_DATA_FILE_BYTES
        checks.append({
            "check": f"file_size:{path}",
            "status": "passed" if size_ok else "failed",
            "bytes": file_size(path)
        })
        check(
            size_ok,
            f"File exceeds 5 MB limit: {path}",
            failures
        )

    total_data_size = sum(
        p.stat().st_size for p in DATA_DIR.rglob("*") if p.is_file()
    )

    checks.append({
        "check": "data_directory_size",
        "status": "passed" if total_data_size <= MAX_DATA_DIR_BYTES else "failed",
        "bytes": total_data_size
    })

    check(
        total_data_size <= MAX_DATA_DIR_BYTES,
        "data directory exceeds 10 MB limit",
        failures
    )

    # Read source and canonical CSV
    with SOURCE.open("r", encoding="utf-8", newline="") as f:
        source_reader = csv.DictReader(f)
        source_columns = source_reader.fieldnames or []
        source_rows = list(source_reader)

    with CANONICAL.open("r", encoding="utf-8", newline="") as f:
        canonical_reader = csv.DictReader(f)
        canonical_columns = canonical_reader.fieldnames or []
        canonical_rows = list(canonical_reader)

    # Column and row limits
    check(
        canonical_columns == EXPECTED_COLUMNS,
        "Canonical columns/order do not exactly match required Phase 3 schema",
        failures
    )

    check(
        len(canonical_columns) <= MAX_COLS,
        "Canonical dataset exceeds 50-column limit",
        failures
    )

    check(
        len(canonical_rows) <= MAX_ROWS,
        "Canonical dataset exceeds 10,000-row limit",
        failures
    )

    check(
        len(canonical_rows) > 0,
        "Canonical dataset is empty",
        failures
    )

    checks.append({
        "check": "canonical_structure",
        "status": "passed" if canonical_columns == EXPECTED_COLUMNS else "failed",
        "rows": len(canonical_rows),
        "columns": len(canonical_columns)
    })

    # Required fields and IDs
    record_ids = []

    for index, row in enumerate(canonical_rows, start=1):
        for field in REQUIRED_FIELDS:
            value = row.get(field, "")
            check(
                value not in ("", None),
                f"Row {index}: required field '{field}' is empty",
                failures
            )

        record_ids.append(row.get("record_id", ""))

        check(
            len(row.get("text_value", "")) <= MAX_TEXT_LENGTH,
            f"Row {index}: text_value exceeds 500 characters",
            failures
        )

        check(
            row.get("is_synthetic") in ("true", "false"),
            f"Row {index}: is_synthetic must be true or false",
            failures
        )

        # ISO UTC timestamp
        timestamp = row.get("observed_at", "")
        check(
            bool(re.fullmatch(
                r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z",
                timestamp
            )),
            f"Row {index}: invalid observed_at format",
            failures
        )

        # Numeric fields
        for field in ["metric_value", "latitude", "longitude"]:
            value = row.get(field, "")
            if value != "":
                try:
                    float(value)
                    check(
                        not re.search(r"[^\d.+\-eE]", value),
                        f"Row {index}: invalid numeric value in {field}",
                        failures
                    )
                except ValueError:
                    failures.append(
                        f"Row {index}: {field} is not numeric"
                    )

        # Restricted/personal data checks
        combined = " ".join(row.values())

        for pattern in RESTRICTED_PATTERNS:
            check(
                not re.search(pattern, combined, re.I),
                f"Row {index}: restricted-data pattern detected",
                failures
            )

        check(
            EMAIL_PATTERN.search(combined) is None,
            f"Row {index}: possible email address detected",
            failures
        )


    unique_ids = set(record_ids)

    check(
        len(unique_ids) == len(record_ids),
        "Duplicate record_id values detected",
        failures
    )

    # Load schema and manifest
    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

    schema_fields = schema.get("columns", [])
    schema_names = [field.get("name") for field in schema_fields]

    check(
        schema_names == EXPECTED_COLUMNS,
        "Schema field order does not match canonical CSV",
        failures
    )

    check(
        manifest.get("source", {}).get("record_count") == len(source_rows),
        "Manifest source record_count does not match source sample",
        failures
    )

    check(
        manifest.get("canonical", {}).get("record_count") == len(canonical_rows),
        "Manifest canonical record_count does not match canonical CSV",
        failures
    )

    check(
        manifest.get("canonical", {}).get("column_count") == len(canonical_columns),
        "Manifest canonical column_count does not match canonical CSV",
        failures
    )

    check(
        manifest.get("source", {}).get("source_field_count") == len(source_columns),
        "Manifest source_field_count does not match source sample",
        failures
    )

    check(
        manifest.get("source_sample", {}).get("record_count") == len(source_rows),
        "Manifest source sample record_count does not match source sample",
        failures
    )

    # Published JSON validation
    try:
        published = json.loads(PUBLISHED.read_text(encoding="utf-8"))
        check(
            isinstance(published, list),
            "Published JSON must contain a list of records",
            failures
        )
    except json.JSONDecodeError as exc:
        published = []
        failures.append(f"Published JSON is invalid: {exc}")

    canonical_as_json = []

    for row in canonical_rows:
        canonical_as_json.append({
            "record_id": row["record_id"],
            "record_type": row["record_type"],
            "observed_at": row["observed_at"],
            "entity_id": row["entity_id"],
            "related_entity_id": row["related_entity_id"] or None,
            "entity_name": row["entity_name"],
            "category": row["category"],
            "subcategory": row["subcategory"],
            "status": row["status"],
            "stage": row["stage"],
            "metric_name": row["metric_name"],
            "metric_value": float(row["metric_value"]),
            "metric_unit": row["metric_unit"],
            "text_value": row["text_value"],
            "latitude": float(row["latitude"]) if row["latitude"] else None,
            "longitude": float(row["longitude"]) if row["longitude"] else None,
            "source_name": row["source_name"],
            "source_record_id": row["source_record_id"],
            "is_synthetic": row["is_synthetic"] == "true",
            "data_version": row["data_version"],
        })

    check(
        published == canonical_as_json,
        "Published JSON does not exactly match canonical CSV",
        failures
    )

    # Manifest package references
    package_paths = [
        "data/canonical/intelligence_data.csv",
        "data/source-sample/source_sample.csv",
        "data/schema.json",
        "data/manifest.json",
        "data/published/intelligence_data.json",
        "data/quality/data_profile.json",
        "data/quality/validation_report.json",
        "data/quality/sampling_report.md",
    ]

    for package_path in package_paths:
        exists = Path(package_path).exists()
        checks.append({
            "check": f"manifest_package_file:{package_path}",
            "status": "passed" if exists else "failed"
        })
        check(
            exists,
            f"Expected package file missing: {package_path}",
            failures
        )

    status = "PASSED" if not failures else "FAILED"

    report = {
        "status": status,
        "package_version": manifest.get("package_version"),
        "record_count": len(canonical_rows),
        "column_count": len(canonical_columns),
        "unique_record_ids": len(unique_ids),
        "failures": failures,
        "checks": checks,
    }

    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    if failures:
        print("VALIDATION FAILED")
        for failure in failures:
            print(f"- {failure}")
        raise SystemExit(1)

    print("VALIDATION PASSED")
    print(f"Records: {len(canonical_rows)}")
    print(f"Columns: {len(canonical_columns)}")
    print(f"Unique record IDs: {len(unique_ids)}")
    print("Published JSON: matches canonical CSV")
    print("Size limits: passed")
    print("Required fields: passed")
    print("Date validation: passed")
    print("Numeric validation: passed")
    print("Boolean validation: passed")
    print("Restricted/personal data checks: passed")
    print("Manifest consistency: passed")
    print("Schema validation: passed")
    print(f"Report: {REPORT}")


if __name__ == "__main__":
    main()
