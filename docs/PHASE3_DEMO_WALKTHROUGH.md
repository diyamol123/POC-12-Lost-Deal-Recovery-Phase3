# Phase 3 Demo Walkthrough

## Live Application

https://poc-12-lost-deal-recovery.vercel.app

## 1. Open the application

Open the live deployment URL in a browser.

## 2. Open Data Intelligence

Navigate to the Data Intelligence page.

Verify that the application displays the validated Phase 3 intelligence package.

## 3. Verify the intelligence package

Confirm:

- Approved track: Track A — Comparative Intelligence
- Data version: phase3-v1.0.0
- Method version: 1.0.0
- Quality status: validated

## 4. Review analytical results

Review the ranked lost-deal categories.

Expected ranking:

1. Price
2. Competitor
3. Product Fit
4. Timing
5. Budget

The primary metric is `deal_value`.

## 5. Review the highest-value finding

The highest-value category is Price, with a total deal value of 4,660,000.

The highest-value individual record is CRM-012 with a deal value of 1,250,000.

## 6. Test the grounded assistant

Example questions:

- What are the top lost-deal categories by total deal value?
- Which category has the highest total deal value?
- What percentage of total deal value comes from Price?

The assistant should answer using the validated deterministic analytical results.

## 7. Assistant grounding boundary

The assistant retrieves authoritative deterministic results first.

Gemini is used only to explain the validated finding and evidence.

The full dataset is not sent to Gemini.

Unsupported analytical or unsafe requests are rejected rather than answered from unsupported assumptions.

## 8. Phase 3 validation coverage

The final certification workflow included:

- Clean-clone validation
- Canonical data validation
- Data readiness validation
- Analytical output validation
- Intelligence contract validation
- Frontend build validation
- Backend startup validation
- Operational regression
- Data Intelligence validation
- Assistant validation
- Automated tests
- Selenium validation
- Final UAT
- Production deployment validation

## 9. Automated test result

Final automated test result:

`61 passed`

## 10. Limitations

- The dataset contains 20 synthetic canonical records.
- Currency is unspecified.
- Timing and Budget groups contain the minimum group size of 3.
- Results are descriptive and do not establish causality.
- The synthetic sample may not represent a complete operational population.
- No predictive or geographic generalization is claimed.

## 11. Final deployment

Production URL:

https://poc-12-lost-deal-recovery.vercel.app

Phase 3 release:

`phase3-v1.0.0`
