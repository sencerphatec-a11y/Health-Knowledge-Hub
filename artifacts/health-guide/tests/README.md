# Medication browser regressions

Run from the repository root:

```sh
pnpm --filter @workspace/health-guide run test:medications
```

This first typechecks the test/configuration files, then runs the same suite in
Chromium, Firefox and WebKit (the engine used by Safari). This checks WebKit,
not the branded Safari app or a physical iPhone.
Each engine has an isolated server on loopback ports 4177, 4178 and 4179,
respectively. Playwright starts and stops those servers;
no running app workflow, database, credentials, or live DailyMed access is needed.
All three ports must be free. Existing processes are deliberately never reused.

Install the browsers matching the locked Playwright version once (and again
after upgrading Playwright):

```sh
pnpm --filter @workspace/health-guide exec playwright install chromium firefox webkit
```

On a supported Linux distribution, install system libraries too using
`pnpm --filter @workspace/health-guide exec playwright install --with-deps chromium firefox webkit`.
That system-dependency installer uses apt; on Replit/NixOS, use Nix-provided
browser libraries instead, not apt:

```sh
pnpm --filter @workspace/health-guide exec node tests/setup-nix-browsers.mjs
pnpm --filter @workspace/health-guide run test:medications
```

The setup script uses Replit's installed `nixpkgs-stable-25_05` and
`nixpkgs-stable-23_11` channels to provide the browser downloads' required ABIs.
It installs matching Firefox/WebKit downloads, links WebKit's extra-library
directory, and saves local launch settings under ignored `.cache/`.
It selects Mesa software rendering for headless WebKit. Playwright's Ubuntu
`ldconfig` probe cannot see Nix libraries, so this setup disables only that
pre-launch host probe; real browser launches and all tests still run normally.
Run setup again after upgrading Playwright or if the browser cache is removed.
No Nix paths or browser binaries are committed to the repository.

Missing browsers or libraries are setup
failures: do not skip an engine or treat those failures as passing tests.

In Replit, the installed Chromium is detected automatically; Firefox and WebKit
still require their matching Playwright downloads and system libraries.
Alternatively set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a locally installed
Chromium executable. This override applies only to the Chromium project.
No absolute browser path is required outside Replit.

For one engine, run:

```sh
pnpm --filter @workspace/health-guide run test:medications --project=firefox
```

## What is exercised

- Real React UI, generated client, API validation, paging, extraction and error
  responses. Only the upstream DailyMed requests are replaced.
- Deterministic unequal category counts (23 prescription, 22 OTC, 3 vaccine,
  with the other categories empty), totaling 48 records over three pages.
- Search button and Enter submission, clearing, next/previous boundaries,
  reload, browser back, and server-clamped/invalid pages.
- Loading controlled by a release gate, empty results, service failures and
  explicit catalog/detail retries, malformed and removed labels.
- Keyboard-only Tab/Shift+Tab, Enter and Space journeys through search,
  next/previous pages, product links, clear/reset, retry and return controls;
  accessible control names and visible focus outlines, including focus recovery
  when loading or navigation removes the active control.
- Persistent polite loading/result status regions (including empty results and
  current page), and alert semantics for catalog/detail failures. These checks
  verify browser semantics, not actual speech from a screen reader.
- Exact original-source URLs, extracted nested uses, missing-use messaging,
  source limitations and all three authored medication guides.
- Unbroken long titles in both list and detail views at 320px and 390px,
  checking text bounds as well as document overflow (not just hidden overflow).

Fixture controls and the substituted fetch are confined to the test process in
`artifacts/api-server/scripts/medication-browser-fixtures.cjs`; production code
has no fixture mode. Queries are unique when needed to avoid sharing successful
responses in the production API cache. Tests run with one worker, serially.
Each project also has a separate server process, so fixture release/failure
controls and cached successful API responses cannot leak between engines.
Keep this isolation when changing worker or project settings.
Upstream URLs without a fixture fail instead of going live.

Failures retain screenshots and Playwright traces in ignored `test-results/`.
Use `pnpm --filter @workspace/health-guide exec playwright show-trace <trace.zip>`
to inspect a failed run. For a focused rerun, append `--grep "long product"` to
the test command.

The complementary backend checks remain:

```sh
pnpm --filter @workspace/api-server run test:medications
```
