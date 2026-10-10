# Medication browser regressions

Run from the repository root:

```sh
pnpm --filter @workspace/health-guide run test:medications
```

This first typechecks the test/configuration files, then runs Chromium against an
isolated server on loopback port 4177. Playwright starts and stops that server;
no running app workflow, database, credentials, or live DailyMed access is needed.
The port must be free. An existing process is deliberately never reused.

In Replit, the installed Chromium is detected automatically. Elsewhere install
the matching browser once:

```sh
pnpm --filter @workspace/health-guide exec playwright install chromium
```

Alternatively set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a locally installed
Chromium executable. No absolute browser path is required outside Replit.

## What is exercised

- Real React UI, generated client, API validation, paging, extraction and error
  responses. Only the upstream DailyMed requests are replaced.
- Deterministic unequal category counts (23 prescription, 22 OTC, 3 vaccine,
  with the other categories empty), totaling 48 records over three pages.
- Search button and Enter submission, clearing, next/previous boundaries,
  reload, browser back, and server-clamped/invalid pages.
- Loading controlled by a release gate, empty results, service failures and
  explicit catalog/detail retries, malformed and removed labels.
- Exact original-source URLs, extracted nested uses, missing-use messaging,
  source limitations and all three authored medication guides.
- Unbroken long titles in both list and detail views at 320px and 390px,
  checking text bounds as well as document overflow (not just hidden overflow).

Fixture controls and the substituted fetch are confined to the test process in
`artifacts/api-server/scripts/medication-browser-fixtures.cjs`; production code
has no fixture mode. Queries are unique when needed to avoid sharing successful
responses in the production API cache. Tests run serially because upstream
controls are shared. Upstream URLs without a fixture fail instead of going live.

Failures retain screenshots and Playwright traces in ignored `test-results/`.
Use `pnpm --filter @workspace/health-guide exec playwright show-trace <trace.zip>`
to inspect a failed run. For a focused rerun, append `--grep "long product"` to
the test command.

The complementary backend checks remain:

```sh
pnpm --filter @workspace/api-server run test:medications
```
