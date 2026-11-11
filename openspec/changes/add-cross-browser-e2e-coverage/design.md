# Design

## Context

`playwright.config.ts` currently puts everything in one global `use`: `launchOptions.args` with `--use-fake-ui-for-media-stream` / `--use-fake-device-for-media-stream` (Chromium-only flags powering the recorder tests) and `permissions: ['microphone']`. The `PLAYWRIGHT_BASE_URL` env switch (deploy-targeted runs) and conditional `webServer` were added with the analytics-delivery spec. The ms-playwright cache has no Firefox build. Specs touching the fake mic: `e2e-tests/consulting-audio.spec.ts` (whole file) and the audio-mode submission test in `e2e-tests/consulting-form.spec.ts` (enumeration of getUserMedia-dependent tests happens as the first task).

See `proposal.md` — Why, for motivation.

## Goals / Non-Goals

**Goals:**
- One command (`bun run test:e2e`) exercises every non-mic test in both engines.
- Mic-dependent tests skip visibly on Firefox — never silently pass or falsely fail.
- Deploy-targeted runs (`PLAYWRIGHT_BASE_URL`) still work per-engine.

**Non-Goals:**
- WebKit coverage, CI e2e execution, video/webgl fake devices, engine-count tuning in reporters.
- Any change to what the tests assert (coverage is a strict superset of today's).

## Decisions

### D1: `projects: [chromium, firefox]` with engine-specific `use`
Global `use` keeps shared settings (baseURL, trace, permissions removed). `launchOptions` (fake-media args) move into the **chromium project only**. `permissions: ['microphone']` moves with them — on Firefox the grant is meaningless without a fake device, and keeping it global invites a false sense of media support. Alternative rejected: separate config files per engine (drift-prone duplication).

### D2: Title-tag gating — `@chromium-only` + `grepInvert` on the firefox project
Mic-dependent tests get `@chromium-only` appended to their test titles; the firefox project sets `grepInvert: /@chromium-only/`. Chosen over per-test `browserName` skip-callbacks: it is Playwright-version-agnostic, greppable, and produces explicit skipped entries in the report rather than absent ones. Alternative rejected: `test.skip(cond)` inside describes (collection-time skip removes the test from BOTH projects unless fixture-based; subtler to get right).

### D3: Setup stays manual-and-documented, not lifecycle hooks
No `globalSetup` auto-install (surprising 90 MB download mid-test-run). Instead: one line in wherever e2e prerequisites live (README e2e section, or `package.json` script comment convention) — `bunx playwright install firefox` — plus `pretest:e2e`-style convenience scripts left out to avoid bundling network fetches into test runs.

### D4: analytics-delivery spec stays engine-agnostic
`securitypolicyviolation` events, `meta[http-equiv]` reads, and `waitForResponse` on `POST */umami/api/send` are supported in Firefox; no spec edits. Its Firefox run is the change's core value (the ghost-CSP differential).

## Risks / Tradeoffs

- [Firefox engine slower/flakier on hydration-race tests] → tests were stabilized once already; if a specific test flakes Firefox-only, tag `@chromium-only` with a tracked issue rather than loosening assertions.
- [Deploy-targeted runs double production traffic per suite run] → negligible for a low-traffic site; per-project scripts (`test:e2e:chromium|firefox`) allow single-engine probes.
- [@chromium-only tags could rot into an over-used escape hatch] → the tag list is grep-able and small by construction (mic tests only); design says don't add non-mic tests to it without a note here.

## Migration Plan

Config + title tags + scripts in one commit; first run does `bunx playwright install firefox`. Rollback = revert commit (chromium behavior byte-identical because shared settings are unchanged).

## Open Questions

- None blocking. Whether to later promote per-engine matrix into CI is a separate, CI-first change.
