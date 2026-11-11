# Proposal

## Why

Umami analytics is currently loaded cross-origin (`https://da.chrislabs.net/script.js`) while the Content-Security-Policy is hardcoded in two independent enforcement layers (`src/components/layout/DefaultLayout.astro` meta tag and `deploy/Caddyfile` header). The browser enforces both policies separately, so every analytics-host change must be mirrored in four places; the current production migration to `da.chrislabs.net` already drifted — the header was fixed only as an uncommitted hotfix on the server, while git HEAD still builds a broken policy that blocks `script.js` and `recorder.js`.

Serving analytics same-origin behind a reverse-proxied path prefix (pattern proven on rainbow-triangle: `handle_path /umami/* { reverse_proxy https://da.chrislabs.net }`, and verified against Umami's `script.js`, which derives its `/api/send` ingest URL from the script tag's own directory path) removes the analytics hostname from the CSP entirely. The drift class disappears because `'self'` already covers every future host change.

## What Changes

- Caddy (deploy layer) gains a `/umami/*` reverse proxy to the configured Umami upstream, covering `script.js`, `recorder.js`, and the `/api/send` + recorder ingest paths.
- **BREAKING** (config): the analytics base URL build-time env is redefined from a bare host (`PUBLIC_UMAMI_HOST=https://da.chrislabs.net`) to a base URL that may be a same-origin path prefix (`PUBLIC_UMAMI_BASE=/umami`); production sets the prefix, local development keeps a cross-origin default.
- The analytics script tags in `DefaultLayout.astro` resolve through that base so production pages reference `/umami/script.js` and `/umami/recorder.js` instead of an absolute analytics origin.
- Both CSP layers are updated so the analytics-related entries become `'self'`-only: the `cloud.umami.is`, `da.chrislabs.net`, and `latitudem2m-analytics...` hostnames are pruned from `script-src` and `connect-src` in production policy; unrelated entries (CDN script hosts, Cloudflare Insights, `crowsys.chrislabs.net` API in `connect-src`) are unchanged.
- The meta CSP stays in sync with the header CSP by construction: the analytics-origin part of the meta policy is derived from the same build-time base that drives the script URLs (Caddyfile remains a static production policy).
- Deploy reconciliation: the uncommitted `deploy/Caddyfile` hotfix on the server is superseded by the committed version of this change; `.env.prod` gains the new base variable.
- Out of scope: propagating this pattern to the other sites in the fleet (`~/services/*` on labserv001), and any broader CSP hardening (e.g., removing `'unsafe-inline'`/`'unsafe-eval'`).

## Capabilities

### New Capabilities
- `analytics-delivery`: how the site loads Umami analytics scripts and routes event/recorder ingest, including the same-origin proxy contract and the CSP alignment guarantees that keep script loading and beaconing consistent across both enforcement layers.

### Modified Capabilities
<!-- none - no existing specs in this project -->

## Impact

- `deploy/Caddyfile` — new `handle_path` proxy block; rewritten CSP header line.
- `src/components/layout/DefaultLayout.astro` — script/recorder URL construction and meta CSP become base-derived.
- `.env.example`, `.env.prod` (deploy host), `docker-compose.yml` build args — env variable rename/redefinition (`PUBLIC_UMAMI_HOST` → `PUBLIC_UMAMI_BASE`).
- Recorder upload path now traverses Caddy + Cloudflare tunnel (body-size/timeouts must be validated).
- No change to `data-umami-event` attributes or event names — e2e test selectors (`e2e-tests/*.spec.ts`) are unaffected.
- Umami side: no change (same website IDs, same ingest endpoints, reached via proxy).
