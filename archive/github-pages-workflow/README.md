# GitHub Pages deployment — status

`deploy.yml` was **restored** to `.github/workflows/deploy.yml` as the
publisher for the **redirect bridge**: GitHub Pages at
`https://crow-systems.github.io` now serves only meta-refresh/canonical
redirects to `https://crowsystems.com.mx`. Build step was adapted from the
full Astro build to `scripts/generate-redirects.mjs`.

This folder is retained as history of the migration. Timeline:

- The Astro site was originally served directly from Pages, which created a
  duplicate-content conflict with `.com.mx` and blocked indexing of the custom
  domain (full reasoning: [Site hosting architecture](../../docs/explanation/site-hosting-architecture.md)).
- The workflow was archived and Pages deactivated (repo renamed + made
  private) so only `.com.mx` existed.
- The repo was renamed back to `Crow-Systems/Crow-Systems.github.io`
  (made public again) and the workflow resurrected — now emitting **redirect
  pages only**, never the site's content — so Google can pass the old host's
  rankings and authority to `.com.mx` via 301-equivalent redirects.

## What the workflow does today

- Runs on every push to `main` and via `workflow_dispatch`.
- Runs `node scripts/generate-redirects.mjs`, writes `dist/` (one index.html
  per route with `meta refresh` + canonical to the matching `.com.mx` path,
  plus `404.html` catch-all and `robots.txt`).
- Uploads `dist/` via `actions/upload-pages-artifact` + `actions/deploy-pages`.

Do not change the build step back to the full-site build — that would
re-create the duplicate-host indexing problem. The redirect bridge must stay
redirect-only.