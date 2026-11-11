# Tasks

## 1. Configuration surface

- [x] 1.1 Rename build arg `PUBLIC_UMAMI_HOST` → `PUBLIC_UMAMI_BASE` in `docker-compose.yml` and update `.env.example` documenting both semantics (absolute URL = cross-origin; leading `/` = same-origin prefix; unset = `https://cloud.umami.is` default)
- [x] 1.2 Update `src/env.d.ts` / any Astro config typing so the new variable name is declared and the old one is gone

## 2. Layout script base and derived meta CSP

- [x] 2.1 In `src/components/layout/DefaultLayout.astro`, read `PUBLIC_UMAMI_BASE` (default `https://cloud.umami.is`) and keep tracker/recorder URL construction as `${base}/script.js` / `${base}/recorder.js` so both modes compose
- [x] 2.2 Compute the meta CSP analytics tokens from the base: absolute URL → origin interpolated into `script-src` and `connect-src`; path prefix → no added entries (`'self'` covers); all non-analytics policy entries stay byte-identical
- [x] 2.3 Confirm no other page/component constructs analytics URLs from the old `PUBLIC_UMAMI_HOST` name

## 3. Edge proxy and header CSP (deploy/Caddyfile)

- [x] 3.1 Add `handle_path /umami/*` reverse-proxy block to `da.chrislabs.net` with `header_up Host` and TLS server name pinned to the upstream hostname (per design D1)
- [x] 3.2 Rewrite the `Content-Security-Policy` header line: remove `cloud.umami.is` and analytics-origin entries from `script-src`/`connect-src`; keep `cdnjs.cloudflare.com`, `cdn.jsdelivr.net`, `static.cloudflareinsights.com`, `crowsys.chrislabs.net`, and all `'unsafe-*'` tokens (per design D4)
- [x] 3.3 Verify remaining Caddy directives (immutable cache for `/_astro/*`, 404 handling) are unaffected by the new `handle_path` block ordering

## 4. Local verification

- [x] 4.1 Run unit (`vitest`) and e2e (Playwright) suites; all `data-umami-event` selectors and tracker helpers stay green (spec: event taxonomy stability)
- [x] 4.2 Build with default (unset) base and assert: script tags use `https://cloud.umami.is`, meta CSP contains that origin
- [x] 4.3 Build with `PUBLIC_UMAMI_BASE=/umami` and assert: script tags are same-origin `/umami/...`, meta CSP has no analytics hostname in either directive
- [x] 4.4 `caddy adapt` (or run the deploy container locally) to validate the Caddyfile syntax, then curl `/umami/script.js` and `/umami/api/send` through the proxy from the container and confirm real Umami responses (not a Cloudflare challenge/error page — risk from design)

## 5. Recorder through the proxy

- [ ] 5.1 Validate a multi-minute recorder session end to end in the deployed context: upload reaches upstream `/api/...` ingest intact; raise `timeouts request_body` / body-size handling in the proxy block if truncated
- [ ] 5.2 Confirm session replay appears in the Umami dashboard for the same website ID (IDs unchanged)

## 6. Deploy and server reconciliation

- [ ] 6.1 Audit `git status` on the server's `mx.com.crowsys/web` checkout; discard the uncommitted `deploy/Caddyfile` hotfix (superseded by 3.1/3.2) and note any other dirty trees found across `~/services/*` for their owners
- [ ] 6.2 Update server `.env.prod`: remove `PUBLIC_UMAMI_HOST`, set `PUBLIC_UMAMI_BASE=/umami`
- [ ] 6.3 `git pull` and `mise run deploy` on the server; confirm the running container was rebuilt from the committed Caddyfile
- [ ] 6.4 Production checks: browser console shows zero CSP violations for tracker/recorder/ingest; dashboard receives live pageviews and named events from `crowsystems.com.mx`; verify rollback path by confirming the single-revert plan is documented in design.md

## Workflow follow-up

- Implement via `/opsx-apply` in a fresh session (explore/propose created planning artifacts only)
- After deploy verification (6.4) passes, archive the change so `analytics-delivery` lands in the main specs
