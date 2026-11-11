# Design

## Context

Current wiring (verified in code):

- `DefaultLayout.astro` builds `${umamiHost}/script.js` and `${umamiHost}/recorder.js` from `PUBLIC_UMAMI_HOST` (default `https://cloud.umami.is`), and hardcodes a static `<meta http-equiv>` CSP containing analytics hostnames in `script-src`/`connect-src`.
- `deploy/Caddyfile` sends an identical hardcoded CSP as an HTTP header. The browser enforces header and meta policies **independently**; a resource must satisfy both.
- `docker-compose.yml` injects `PUBLIC_UMAMI_HOST` as a build arg; the deployed container's Caddyfile currently carries an **uncommitted hotfix** on the server (`da.chrislabs.net` replaces `latitudem2m-analytics.chrislabs.net` only in the working tree).
- Umami's `script.js` computes its ingest URL from the script tag's own directory: `src.split("/").slice(0,-1).join("/") + "/api/send"` (confirmed against the live `da.chrislabs.net/script.js`). Therefore `/umami/script.js` beacons to `/umami/api/send` — path-preserving, same-origin.
- Pattern proven in production on rainbow-triangle: `handle_path /umami/* { reverse_proxy https://da.chrislabs.net }` — analytics never blocked by CSP because `'self'` covers everything.

See `proposal.md` — Why, for motivation.

## Goals / Non-Goals

**Goals:**
- Analytics hostname appears exactly once per site (the edge proxy target), nowhere in HTML, script tags, or CSP.
- Header and meta CSP policies agree on analytics by construction, not by manual mirroring.
- Existing cloud/cross-origin mode remains available for local development.

**Non-Goals:**
- Rolling this pattern to other sites in `~/services/*` on labserv001 (separate follow-up per repo).
- Broader CSP hardening: removing `'unsafe-inline'`/`'unsafe-eval'`, adopting nonces (the blog pattern), pruning CDN allowlist entries — all deferred.
- Umami server-side changes (hosting, website IDs, dashboard configuration).

## Decisions

### D1: Edge reverse proxy at `/umami/*` (chosen over alternatives)
Caddy gains:

```
handle_path /umami/* {
    reverse_proxy https://da.chrislabs.net {
        header_up Host da.chrislabs.net
        transport http { tls_server_name da.chrislabs.net }
    }
}
```

`handle_path` strips `/umami`, so `/umami/script.js` → upstream `/script.js` and `/umami/api/send` → upstream `/api/send` (matches the path-based derivation verified above; recorder ingest behaves the same — validate in tasks). Host header and SNI must equal the upstream hostname because `da.chrislabs.net` is itself a hostname-routed Cloudflare tunnel; the wrong Host yields a CF error page instead of the script.

Alternatives rejected: (a) dedicated analytics subdomain of the same registrable domain — still a cross-origin CSP entry, drift persists; (b) rewriting only `/script.js` at root — pollutes the root path space and doesn't cover ingest paths.

### D2: Redefine the env as `PUBLIC_UMAMI_BASE` (absolute URL or path prefix)
One build-time value; semantics chosen by shape:

- unset → `https://cloud.umami.is` (current default, cross-origin, local dev)
- absolute URL → cross-origin mode with that origin
- value starting with `/` → same-origin prefix mode

Chosen over keeping `PUBLIC_UMAMI_HOST` and overloading it with a path ("host" holding `/umami` is misleading) and over a boolean flag + host (two knobs that can disagree). `docker-compose.yml` build args, `.env.example`, and the server's `.env.prod` rename accordingly. Script/recorder URL construction in `DefaultLayout.astro` stays `base + "/script.js"` — it already composes correctly for both shapes.

### D3: Meta CSP analytics tokens derived from the same base value
`DefaultLayout.astro` computes the analytics-related tokens: in prefix mode, nothing is added (`'self'` suffices); in absolute-URL mode, the origin is interpolated into `script-src` and `connect-src`. The rest of the meta policy string is untouched. This keeps the two layers agreeing on analytics automatically; the Caddyfile header becomes analytics-agnostic (`'self'` only for analytics paths) so it never needs edits on upstream migrations.

Alternative rejected: deleting the meta CSP entirely (header-only enforcement) — the meta tag is defense-in-depth if headers are stripped at some edge; changing the enforcement model is a bigger conversation than this change.

### D4: Prune stale analytics hostnames from the production policy
Header and meta lose `cloud.umami.is` and `da.chrislabs.net` entries in production config (prefix mode); `latitudem2m-analytics.chrislabs.net` disappears with the rewrite of the same lines. Kept: `cdnjs.cloudflare.com`, `cdn.jsdelivr.net` (flyer page external scripts), `static.cloudflareinsights.com`, `crowsys.chrislabs.net` in `connect-src` (form API), and `'unsafe-inline'`/`'unsafe-eval'`/`'unsafe-hashes'` (out of scope per Non-Goals; `'unsafe-eval'` is required by the Cloudflare Insights beacon).

### D5: Reconcile the uncommitted server hotfix by superseding it
The committed Caddyfile (with proxy + pruned CSP) replaces the same lines the hotfix touched. Deploy procedure: on the server, `git stash drop`/discard the dirty `deploy/Caddyfile`, `git pull`, then `mise run deploy`. A `git status` audit across `~/services/*` repos runs at deploy time to catch other orphaned fixes (observed during exploration; only crowsys is in this change's blast radius).

## Risks / Trade-offs

- [Proxy adds a hop through the public internet per script fetch and per beacon; CF bot protection on the Umami origin could challenge Caddy's server-side requests] → Validate `curl` through the proxy from the container during tasks; if challenged, allow-list the edge IP or use Umami's tunnel directly (private-network `service:` URL in ingress) instead of the public hostname.
- [Recorder audio uploads through Caddy + cloudflared may hit body-size/timeout defaults] → Test a multi-minute recording end to end; raise `timeouts request_body` / `request_header` in the proxy block as needed.
- [`script.js` path-derivation assumption breaks on an Umami upgrade] → The override variable (`x ||` in script.js) suggests a data attribute escape hatch; scenario test asserts events land in the dashboard after deploy, and rollback is a one-revert.
- [Two CSP layers remain (meta + header); drift is only structurally removed for the analytics tokens] → Accepted; enforcement-model change is explicitly a Non-Goal.
- [`PUBLIC_UMAMI_HOST` → `PUBLIC_UMAMI_BASE` is a config-breaking rename] → `.env.example` documents both semantics; deploy procedure updates `.env.prod` in the same step.

## Migration Plan

1. Commit layout, Caddyfile, compose, `.env.example` changes (this repo).
2. On labserv001: discard the dirty `deploy/Caddyfile` (its content is superseded), `git pull`, set `PUBLIC_UMAMI_BASE=/umami` in `.env.prod` (remove old var), `mise run deploy` (`--force-recreate www www_cloudflare`).
3. Verify: production HTML contains `/umami/script.js`; console shows zero CSP violations; Umami dashboard receives pageviews/events from `crowsystems.com.mx`; recorder upload works.
4. Rollback: revert commit, restore `.env.prod` (`PUBLIC_UMAMI_HOST=https://da.chrislabs.net`), redeploy. Old cross-origin mode keeps working because D2 preserves absolute-URL semantics.

## Open Questions

- Whether to also serve `/umami/script.js` with a short `Cache-Control` (upstream sends none usable for a browser cache today); can be tuned post-deploy without behavior change.
- Fleet rollout sequencing (blog-derived CSP sites vs. no-CSP sites) — tracked outside this repo.
