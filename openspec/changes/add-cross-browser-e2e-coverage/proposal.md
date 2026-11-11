# Proposal

## Why

The e2e suite runs only in Chromium. This session proved exactly why one engine is a blind spot: the site is verifiably healthy in headless Chromium (5/5 analytics-delivery checks against production, zero CSP violations) while one user's Firefox showed eleven errors caused by a client-side CSP injection that no server-side evidence can reproduce. A clean, second-engine run is the control that separates "our site" from "their machine" — and Firefox is also the stricter consumer of CSP details (inline/`unsafe-inline` parsing, `script-src-elem` fallback), so policy regressions can bite there first.

## What Changes

- Playwright runs the suite in **two browser projects: Chromium and Firefox** (`bun run test:e2e` executes both).
- Chromium-only launch options (fake microphone device/permission flags used by the audio-recorder tests) move from the global `use` block into the Chromium project; the Firefox project carries no fake-media flags.
- Tests that depend on `getUserMedia` fake-device behavior (consulting audio flows) are gated to Chromium with explicit skip labels on Firefox — no false failures, visible skips.
- `package.json` gains convenience scripts (`test:e2e:chromium`, `test:e2e:firefox`) and the `bunx playwright install firefox` setup step is documented where e2e setup is described.
- The `analytics-delivery` spec suite (CSP-violation listener, meta/header policy checks, `/umami/api/send` ingest probe) runs unmodified on both engines — its APIs are cross-engine; this is the primary payload of the change.
- No product behavior changes: nothing in `src/`, `deploy/`, or the built site is touched.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
<!-- none -->

This change is **test tooling only** — no externally observable system behavior changes — so the change declares `skip_specs: true` and carries no spec deltas. The capability it *protects* is `analytics-delivery` (from `add-same-origin-umami-proxy`); its scenarios simply become validated on a second engine.

## Impact

- `playwright.config.ts` — projects split (chromium/firefox), launch-args relocation, baseURL/PLAYWRIGHT_BASE_URL logic preserved.
- `e2e-tests/consulting-audio.spec.ts` (and any other mic-dependent specs) — Chromium-only gating.
- `package.json` — two convenience scripts.
- Local developer machines: one-time `bunx playwright install firefox` (~90 MB browser download); CI unaffected (it does not run e2e).
- Sequencing note: complements, does not block, the still-open manual recorder checks (tasks 5.1/5.2) of `add-same-origin-umami-proxy`.
