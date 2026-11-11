# Tasks

## 1. Enumerate getUserMedia-dependent tests

- [x] 1.1 Grep `e2e-tests/` for fake-mic dependencies (recorder toggles, `getUserMedia`, audio fixtures); expected baseline: all of `consulting-audio.spec.ts` plus the audio-mode submission test in `consulting-form.spec.ts` and any mic-touching error-handling case — record the final list in the commit message

## 2. Split Playwright projects per engine

- [x] 2.1 In `playwright.config.ts`, add `projects: [{name:'chromium', use:{...chromium launchOptions + microphone permissions}}, {name:'firefox', grepInvert: /@chromium-only/}]`; keep global `use` free of engine-specific flags; preserve the `PLAYWRIGHT_BASE_URL`/conditional-`webServer` logic unchanged
- [x] 2.2 Append `@chromium-only` to the test titles found in 1.1 (titles only; no assertion changes)
- [x] 2.3 Add `test:e2e:chromium` (`playwright test --project=chromium`) and `test:e2e:firefox` (`--project=firefox`) scripts to `package.json`

## 3. Setup and documentation

- [x] 3.1 Run `bunx playwright install firefox` once locally; confirm `~/.cache/ms-playwright` contains the firefox build
- [x] 3.2 Add the Firefox install line to `docs/how-to/run-tests.md` under the e2e prerequisites (keep existing content intact)

## 4. Verification

- [x] 4.1 Local dual-engine run: `bun run test:e2e` — every non-mic test passes in BOTH chromium and firefox projects; mic tests execute in chromium and appear as grepInvert-skips (not failures) in firefox
- [x] 4.2 Regression check: chromium results identical to the pre-change baseline (26 pass / 3 backend-env fails / analytics-skips), proving shared settings were not disturbed
- [x] 4.3 Deployment differential (the change's purpose): `PLAYWRIGHT_BASE_URL=https://crowsystems.com.mx bunx playwright test e2e-tests/analytics-delivery.spec.ts --project=firefox` — 5/5 green in clean Firefox (zero CSP violations, ingest via `/umami/api/send`), the control result that engine-neutrality holds server-side

## Workflow follow-up

- Implement via `/opsx-apply` in a fresh session
- Archive after 4.1–4.3 pass (no specs to sync — `skip_specs: true`)
