# PoC-12 Expanded Synthetic Lost Deal Intelligence Dataset

## Overview
Optional portfolio experiment expanding the accepted 20-record PoC-12 dataset to 500 synthetic records.

## Dataset
- Total records: 500
- Original records preserved: 20
- Additional synthetic records: 480
- Columns: 20
- Data version: portfolio-synth-v1.0.0
- Random seed: 120026
- Currency: Unspecified

## Methodology
Records are grouped by category. The analysis calculates record count, total value, average value, contribution percentage and priority ranking.

## Illustrative Results
| Category | Records | Contribution | Rank |
|---|---:|---:|---:|
| Timing | 99 | 21.67% | 1 |
| Competitor | 101 | 20.17% | 2 |
| Product Fit | 100 | 20.13% | 3 |
| Price | 101 | 19.73% | 4 |
| Budget | 99 | 18.29% | 5 |

Overall average: 589195.5917 unspecified currency units.

## Reproduction
Run from the project root:
- python3 portfolio-experiment/generate_dataset.py
- python3 portfolio-experiment/run_analysis.py

## Limitations
All records are synthetic. Results are descriptive only and do not establish causality, predict real customer behaviour or guarantee revenue recovery.

The accepted production project and original analytical pipeline remain unchanged.
