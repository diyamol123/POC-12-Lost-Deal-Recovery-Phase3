# Post #6 — Enterprise BI UX Changelog

Date: 6 November 2026

## Release identity

- Repository: POC-12-Lost-Deal-Recovery-Phase3
- Branch: feat/portfolio-intelligence-enhancement
- Application commit: 75dab77
- Production: Operator-confirmed working and aligned to 75dab77
- Repomix: repomix-post6-ux-final.xml
- Repomix validation: XML VALID
- Repomix security result: No suspicious files detected

## E0 — Release baseline
- Preserved the existing Phase 3 application and analytical workflows.
- Used the UX enhancement branch for the Post #6 changes.
- Captured the application source at commit 75dab77.

## E1 — Dashboard and responsive presentation
- Completed the dashboard UX enhancement.
- Captured desktop and mobile screenshots for the release evidence pack.

## E2 — Charts and data presentation
- Reconnected the dashboard chart component to the 500-record dataset.
- Retained observed lost-deal value, Pareto, and segment visualizations.
- Removed the unsupported competitor-loss-count chart because the source records do not contain a dedicated competitor field.
- Preserved the existing data rather than inventing competitor values.

## E3 — Intelligence workflow
- Retained the Intelligence page and its supported comparative analysis.
- Preserved evidence-backed category comparisons and sensitivity analysis.
- CRM-012 sensitivity is hypothetical and does not modify the baseline data.

## E4 — Assistant workflows
- Retained the Portfolio Assistant and Grounded Assistant interfaces.
- Assistant outputs remain subject to the existing evidence and grounding controls.

## E5 — Validation and deployment
- `git diff --check` passed during the final code changes.
- `npm run lint` passed.
- `npm run build` passed.
- GitHub push completed for commit 75dab77.
- Vercel Preview and Production were operator-confirmed working.
- Production was operator-confirmed to show commit 75dab77.
- Seven desktop/mobile screenshots were captured.
- Fresh Repomix generated with 184 files.
- Repomix XML parsing passed.

## Screenshot evidence

- 01-desktop-overview.png
- 02-desktop-intelligence-top.png
- 03-desktop-intelligence-details.png
- 04-mobile-charts.png
- 05-mobile-intelligence.png
- 06-mobile-portfolio-assistant.png
- 07-mobile-grounded-assistant.png

Location: docs/screenshots/

## Known limitations

- The dataset is synthetic; results should not be interpreted as verified real-world outcomes.
- Currency is unspecified in the source data. Values must not be labelled as INR or USD without supporting metadata.
- Comparative findings are descriptive and do not establish causality.
- Competitor-specific counts must not be presented as verified where dedicated competitor fields are absent.
- Existing analytical and assistant limitations remain documented in:
  - WEAK_CASE_AND_LIMITATION_REVIEW.md
  - PHASE3_RELEASE_MANIFEST.md

## Remaining handover items

- Attach the 7-minute 33-second walkthrough video and provide its share link.
- Obtain reviewer acceptance and complete the Post #6 submission.
- Preserve the historical Phase 3 release manifest and tags.
