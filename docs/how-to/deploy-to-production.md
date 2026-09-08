# How to deploy to production

## Goal

Publish the site to `https://crowsystems.com.mx`. Builds are static, served by
Caddy inside Docker behind a Cloudflare Tunnel (see the
[architecture explanation](../explanation/site-hosting-architecture.md)).

## Prerequisites

- The `Crow-Systems/Crow-Systems.github.io` repo checked out.

  > Note: this is the org's special-name repo and hosts the GitHub Pages
  > **redirect bridge** (301-equivalent redirects to `.com.mx`). The site
  > itself is not served from Pages — deployment below targets the
  > caddy/Cloudflare stack.
- `mise` available, Docker available, and the Cloudflare tunnel reachable.
- `.env.prod` with `SITE_URL=https://crowsystems.com.mx` and the traffic/analytics
  variables it documents (`.env.example` is the template).

## Steps

1. **Build and deploy**:
   ```bash
   mise run deploy
   ```
   This sources `.env.prod`, builds the Docker image (`SITE_URL` becomes every
   canonical/hreflang/sitemap URL), and runs `docker compose up -d --build`.

2. **Verify the build output** before relying on it:
   ```bash
   bun run build          # same output, local
   cut -d'>' -f2 dist/sitemap.xml | grep -o 'https://[^<]*' | head
   ```
   Every URL must be `https://crowsystems.com.mx/...`. If `.env.prod` isn't
   sourced, build output falls back to the `https://crowsystems.com.mx` default
   in `astro.config.ts`.

3. **Verify the live site**:
   ```bash
   curl -s https://crowsystems.com.mx/robots.txt          # 200, Sitemap line present
   curl -s -o /dev/null -w "%{http_code}\n" https://crowsystems.com.mx/sitemap.xml   # 200
   curl -s https://crowsystems.com.mx/ | grep -o 'rel="canonical" href="[^"]*"'
   # → rel="canonical" href="https://crowsystems.com.mx/"
   ```

## After deploying

- If you changed canonical-affecting config (`SITE_URL`, routes): submit the
  sitemap in Google Search Console and use URL Inspection → *Request indexing*
  on the homepage. Expect days-to-weeks for a young domain.
- Keep the redirect bridge ([`scripts/generate-redirects.mjs`](../../scripts/generate-redirects.mjs))
  up to date with the route list in `dist/sitemap.xml` — the old host's
  authority transfers to `.com.mx` through it. Re-publishing it is
  `git push` to `main` (workflow in `.github/workflows/deploy.yml`).
- Never point GitHub Pages at the real site build: the bridge must stay
  redirect-only, or the duplicate-host conflict returns.