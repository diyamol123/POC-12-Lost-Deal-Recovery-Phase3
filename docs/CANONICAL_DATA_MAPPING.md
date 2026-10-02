# Canonical Data Mapping

## Purpose

This document records the transformation from the Phase 2 synthetic CRM dataset into the Phase 3 canonical data package.

The canonical single source of truth is:

`data/canonical/intelligence_data.csv`

## Source-to-Canonical Mapping

| Source field | Canonical field | Transformation |
|---|---|---|
| `id` | `record_id` | Direct mapping; stable source record ID |
| `id` | `source_record_id` | Direct mapping |
| — | `record_type` | Derived as `lost_deal` from the Phase 2 Lost Deal Recovery dataset |
| `date` | `observed_at` | Converted from `YYYY-MM-DD` to ISO UTC datetime at midnight; source contains no time component |
| `id` | `entity_id` | Uses the source deal ID as the stable entity reference |
| — | `related_entity_id` | Null; no separate related-entity ID was supplied |
| `company` | `entity_name` | Direct mapping |
| `reason` | `category` | Direct semantic mapping of lost-deal reason |
| `product` | `subcategory` | Direct mapping of product category |
| `priority` | `status` | Direct mapping of the supplied operational priority value |
| `stage` | `stage` | Direct mapping |
| — | `metric_name` | Derived as `deal_value` |
| `value` | `metric_value` | Numeric deal value |
| — | `metric_unit` | `currency_unspecified`, because the supplied source does not explicitly identify the currency |
| `action` | `text_value` | Direct mapping; source action text retained |
| — | `latitude` | Null; no coordinates supplied |
| — | `longitude` | Null; no coordinates supplied |
| — | `source_name` | Derived as `Phase 2 synthetic CRM dataset` |
| — | `is_synthetic` | Set to `true` for all records |
| — | `data_version` | Set to `phase3-v1.0.0` |

## Source Fields Not Directly Represented

The following source fields do not have dedicated canonical columns and are therefore not copied into unrelated canonical fields:

- `location`
- `team`
- `segment`
- `competitor`

These fields are retained in the original Phase 2 source representation and are not silently repurposed.

## Null Handling

The following canonical fields are intentionally blank because the supplied source does not provide the required information:

- `related_entity_id`
- `latitude`
- `longitude`

No coordinates are geocoded or inferred.

## Synthetic Data

The Phase 2 application identifies the CRM records as synthetic where operational data is unavailable. Therefore:

`is_synthetic = true`

for every canonical record.

## Date Handling

The source contains date-only values such as:

`2026-01-08`

No source time or timezone was provided. The canonical pipeline represents these as:

`2026-01-08T00:00:00Z`

The midnight time is a normalization convention, not a claim that the source recorded an event at that exact time.

## Text Handling

The source `action` field is mapped to `text_value`.

The supplied action strings are retained without adding new content.

## Numeric Handling

The source `value` field is converted to the numeric `metric_value` field.

No currency symbols are stored in the numeric value.

## Record Identity

`record_id` and `source_record_id` are both derived from the stable Phase 2 `id` field.

The current source contains unique IDs from `CRM-001` through `CRM-020`.

## Data Version

All records in this canonical package use:

`phase3-v1.0.0`

