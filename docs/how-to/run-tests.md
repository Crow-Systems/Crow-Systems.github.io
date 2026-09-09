# How to run the tests

## Goal

Run the project's automated tests locally: the **unit tests** (vitest, fast,
no network) and the **end-to-end tests** (Playwright, real browser + real
backend). Each suite guards a different layer, so run both before merging.

## Prerequisites

- Dependencies installed (`bun install`).
- For e2e only: the backend reachable through the dev server. Happy-path form
  tests POST real leads, so bring the API up first — see
  [How to run the API locally](run-api-locally.md).

## Steps

### 1. Run the unit tests (one-off)

```bash
bun run test
```

Runs `vitest run` against `src/**/*.test.ts`. These test pure logic with no
network: the API client (`src/scripts/api.test.ts`), draft persistence
(`src/scripts/form-draft.test.ts`), the HTML sanitizer
(`src/scripts/sanitize.test.ts`), and the locale helpers
(`src/locales/index.test.ts`).

### 2. Run the unit tests in watch mode (while developing)

```bash
bun run test:watch
```

Re-runs the affected tests on every save.

### 3. Run the e2e suite

```bash
bun run test:e2e
```

Playwright starts `astro dev` on port 4321 itself (or reuses one already
running). The suite lives in `e2e-tests/`:

- **Form flows** — contact and consulting (text + audio) submission,
  validation, draft persistence, and error banners.
- **Layout widgets** — nav menus (desktop dropdown + mobile hamburger) and the
  WhatsApp chat card.
- **Audio recorder** — recording, playback, reload persistence, and corrupted
  blob handling.

### 4. Run a single spec

```bash
bunx playwright test e2e-tests/error-handling.spec.ts
```

## Notes

- **E2E happy paths write real data.** Submissions reach the backend with an
  `E2E ... <timestamp>` name so they are identifiable. Route-interception
  tests (`error-handling.spec.ts`) use Playwright mocks and never touch the
  backend.
- **Do not run the suites through `astro build` output.** Playwright expects
  the dev server on `:4321` (see `playwright.config.ts`).

Related: [Dev environment reference](../reference/dev-environment.md) ·
[How to run the API locally](run-api-locally.md)