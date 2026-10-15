# Final Automated Test Report

## Status

PASS for the automated checks executed during the final validation pass.

## Executed Results

| Check | Result |
|---|---|
| Python test suite (`PYTHONPATH=. python3 -m pytest tests -q`) | 59 passed |
| TypeScript intelligence contract (`npx tsx tests/intelligence-contract/test_intelligence_validator.test.ts`) | 2 passed, 0 failed |
| Selenium Data Intelligence journey (standalone rerun) | 1 passed |
| ESLint (`npm run lint`) | Passed |
| Next.js production build (`npm run build`) | Passed |

The standalone Selenium journey was also run separately for confirmation.
It may overlap with the Python test suite and is not added to the unique test
count.

## Scope and Limitations

The executed checks cover the repository's automated tests, intelligence
output contract, browser journey, linting, and production build.

Assistant safety cases marked `IMPLEMENTED` in the assistant validation and
UAT reports are not claimed as individually executed end-to-end tests here.
See `docs/FINAL_ASSISTANT_VALIDATION.md` for that distinction.

## Clean Clone

A new clean-clone execution has not been independently confirmed during this
final validation pass. Earlier clean-clone results may be documented in
historical reports, but this report does not present them as a new run.

## Conclusion

All checks listed under Executed Results passed in the recorded final
validation pass. The clean-clone status remains unconfirmed for this pass.
