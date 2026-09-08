# Site hosting architecture (Explanation)

## Context

CROW SYSTEMS' marketing site is built with Astro and deployed as static files.
The git repository is named `Crow-Systems/Crow-Systems.github.io` because the
site was originally hosted on **GitHub Pages** at `https://crow-systems.github.io`.

Hosting later moved to a self-managed stack — a Dockerized [Caddy](deploy/../deploy/Caddyfile)
server behind a **Cloudflare Tunnel** — serving the custom domain
`https://crowsystems.com.mx`. The GitHub Pages deployment was retained for a
while, which turned out to be a mistake. This page explains why it was retired.

## The problem: duplicate content with conflicting canonicals

At one point the exact same site was live on **two** hosts at once:

| Host | Canonical it declared | Status |
|---|---|---|
| `https://crow-systems.github.io` | `https://crow-systems.github.io` | indexed by Google |
| `https://crowsystems.com.mx` | `https://crowsystems.com.mx` | **not indexed** |

Both copies were byte-identical, and each declared *itself* canonical via
`<link rel="canonical">`. Google does not accept two different canonicals for
the same content: it deduplicates and picks one host as the source of truth.
Because the GitHub Pages version had existed longer, Google chose
`crow-systems.github.io`, and treated every `crowsystems.com.mx` page as a
duplicate. The result, visible in Google Search Console for months:

- `crowsystems.com.mx/sitemap.xml` — read successfully, 18 URLs discovered.
- `crowsystems.com.mx/*` — **"Duplicate, Google chose different canonical"**;
  nothing from the custom domain ever reached the index.

The sitemap was never the problem. The conflicting twin host was.

## The rule

**`https://crowsystems.com.mx` is the only canonical host.** Every public URL
must be `https://crowsystems.com.mx`, every page must carry a self-referential
canonical to `.com.mx`, and no other host may serve this content.

Consequences that follow from the rule:

- `crow-systems.github.io` is a **redirect bridge, not a site**: the repo
  `Crow-Systems/Crow-Systems.github.io` exists solely so GitHub Pages can emit
  301-equivalent redirects (meta refresh + canonical) for every old URL to the
  matching path on `.com.mx`. It never serves site content, so it causes no
  duplicate. The full reasoning for the bridge: the old host had years of
  indexation and backlinks; a straight 404 flush would discard that authority.
- The bridge works because old and new paths are identical — `/en/about/`
  redirects to `https://crowsystems.com.mx/en/about/`. The repo is public
  (Pages requires it) and carries only the redirect generator
  (`scripts/generate-redirects.mjs`) plus its deploy workflow.
- `www.crowsystems.com.mx` must redirect (301) to the apex instead of serving
  content, or it becomes a third competing host.
- `SITE_URL` (which becomes `Astro.site` and every canonical/hreflang URL) is
  set per environment. Production builds read `.env.prod`;
  `astro.config.ts` defaults to `https://crowsystems.com.mx`, never to a
  `*.github.io` host.

## Why GitHub Pages specifically was wrong here

GitHub Pages is a fine place to host a purely static site when you *want* the
`*.github.io` domain. It was the wrong tool once a branded domain took over:

- **No clean canonical story.** GitHub Pages serves raw HTML; steering Google
  toward a different host requires `canonical`/`noindex` hacks that lag weeks.
- **It kept re-deploying.** The workflow ran on every push to `main`, so the
  duplicate twin stayed current (and indexable) no matter how often we fixed
  the canonical tags on the canonical host.
- **The indexing penalty is asymmetric.** Google does not "catch up" a new
  domain while a trusted duplicate exists; the old host keeps winning the
  canonical battle indefinitely.

The fix is to make Pages stop serving the site's *content* while still
answering on the old URLs: `crow-systems.github.io` now responds only with
redirects to `.com.mx`, so there is no duplicate content and no second
canonical — yet the old host's authority transfers instead of being flushed.

## Current architecture

```
browser ── HTTPS ──> crowsystems.com.mx ── Cloudflare Tunnel ──> Docker (Caddy)
                                                                    │
                                                            dist/ (Astro static build)
                                                                    ▲
                                          built from sources via `mise run deploy`
                                          (reads SITE_URL from .env.prod)

crow-systems.github.io ──(GitHub Pages, redirect bridge only)──> crowsystems.com.mx
    /<path>  →  https://crowsystems.com.mx/<path>   (meta refresh + canonical)
```

- Builds and deploys: `bun run build` / `mise run deploy` (see
  `.mise.toml`, `Dockerfile`, `docker-compose.yml`, `deploy/Caddyfile`).
- Redirect bridge: `scripts/generate-redirects.mjs` + `.github/workflows/deploy.yml`
  publish the redirect-only Pages site from the public
  `Crow-Systems/Crow-Systems.github.io` repo.
- Canonicals and the sitemap are generated from `SITE_URL` in
  `astro.config.ts`; the sitemap is flattened to `sitemap.xml` by
  `scripts/sitemap-flatten.mjs`.
- `public/robots.txt` advertises `https://crowsystems.com.mx/sitemap.xml`;
  Cloudflare additionally serves a managed robots preamble (recent crawler
  blocks) ahead of it.

## If indexing still looks stuck

On a young `.com.mx` domain, "Discovered - currently not indexed" and
"Crawled - currently not indexed" are ordinary states for weeks. Escalation
path, in order:

1. Confirm the bridge is redirect-only — `curl -s https://crow-systems.github.io/`
   must show a `meta refresh`/canonical to `.com.mx`, never site content.
2. Confirm both Search Console properties exist and the old
   `crow-systems.github.io` is still verified; run the old property's
   **Settings → Change of Address** to `crowsystems.com.mx`.
3. Google Search Console → URL Inspection on
   `https://crowsystems.com.mx/` → *Request indexing*.
4. Wait; Google's crawl schedule is days-to-weeks, not hours.

## Related

- [How to deploy to production](../how-to/deploy-to-production.md)
- [How to measure page performance](../how-to/measure-performance.md) (unrelated
  to hosting, listed for navigation completeness)