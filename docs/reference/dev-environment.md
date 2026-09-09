# Dev environment reference

Facts about running the web frontend and the backend API for development and
e2e testing.

## npm scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `astro dev` | Web dev server on `:4321` |
| `dev:api` | `docker compose -f ../api/docker-compose.yml --project-directory ../api up -d` | Bring up the backend Compose stack (idempotent) |
| `dev:all` | `dev:api && astro dev` | Backend + web in one command |
| `test` | `vitest run` | Unit tests (`src/**/*.test.ts`) |
| `test:watch` | `vitest` | Unit tests, watch mode |
| `test:e2e` | `playwright test` | Playwright suite (`e2e-tests/`) |
| `build` | `astro check && astro build && node scripts/sitemap-flatten.mjs` | Production build |

## Environment variables

| Variable | File | Default | Used at |
|---|---|---|---|
| `PUBLIC_API_BASE_URL` | `.env.development` | `/api/v1` | Dev only |
| `PUBLIC_API_BASE_URL` | — | `https://crowsys.chrislabs.net/api/v1` | Production (fallback in `src/scripts/api.ts`) |
| `PUBLIC_CONTACT_ENDPOINT` | — | `/contact` | Both |
| `PUBLIC_CONSULTATION_ENDPOINT` | — | `/consultation` | Both |
| `PUBLIC_AUDIO_UPLOAD_ENDPOINT` | — | `/audio/upload` | Both |

`.env.development` applies only to `astro dev`; `astro build` ignores it, so
production bundles keep the absolute default URL.

## Dev-server API proxy

`astro.config.ts` (`vite.server.proxy`):

- `/api/v1` → `https://crowsys.chrislabs.net`

With `PUBLIC_API_BASE_URL=/api/v1`, browser API calls are same-origin
(`http://localhost:4321/api/v1/...`) and are forwarded by the dev server to the
backend. No CORS is involved. The proxy is dev-only: it has no effect on
static production builds.

## Ports

| Port | Service |
|---|---|
| `4321` | Web dev server (`astro dev`) — Playwright `baseURL` |
| `9091` | API inside the Compose network (not published to the host) |
| `3000` | Bare `api/` dev server, only if run standalone (`PORT` env) |

## Backend request/response contract

Base from `PUBLIC_API_BASE_URL`, paths appended. Non-2xx responses throw
`ApiError` with `errorKey`; the frontend maps `VALIDATION_*` keys to fields,
otherwise shows a banner. See `src/scripts/api.ts`.

- `GET /api/v1/health` → `{ success, message, data }`
- `POST /api/v1/contact` → JSON `{ name, email, subject, message }`
- `POST /api/v1/consultation` → JSON `{ fullName, phone, businessProblem, email?, company?, projectGoals?, budgetRange? }` (requires `businessProblem` ≥ 20 chars)
- `POST /api/v1/audio/upload` → multipart `FormData` `{ audio, fullName?, phone?, email?, company?, description? }`

## Unit tests

- Framework: vitest (`vitest.config.ts`), jsdom environment.
- Tests live next to the code they cover as `src/**/*.test.ts`:
  `src/scripts/api.test.ts`, `src/scripts/form-draft.test.ts`,
  `src/scripts/sanitize.test.ts`, `src/locales/index.test.ts`.
- No network or browser; `fetch` is stubbed where the API client is exercised.
- Excluded from `astro check` via `tsconfig.json` `exclude`.

## E2E suite

- Tests: `e2e-tests/` — form flows (`contact-form` `consulting-form`),
  error banners (`error-handling`), layout widgets (`layout-widgets`), audio
  recorder (`consulting-audio`).
- `playwright.config.ts`: `baseURL http://localhost:4321`, auto-spawns
  `bun run dev --port 4321`, 3 workers, fake media devices for the recorder.
- `e2e-tests/helpers.ts` `waitForHydration()` waits for the React island to
  hydrate before interacting, preventing native form submissions on cold
  starts.
- Happy-path submits write **real leads** (identified `E2E ... <timestamp>`)
  to the backend; `error-handling.spec.ts` mocks responses via `page.route`.

Related: [How to run the tests](../how-to/run-tests.md) ·
[How to run the API locally](../how-to/run-api-locally.md) ·
[Why development reaches the API through a proxy](../explanation/networking-stack.md#development-traffic-reaches-the-api-through-a-proxy)