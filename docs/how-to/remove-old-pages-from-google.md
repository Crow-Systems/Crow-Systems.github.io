# How to remove the old host from Google Search results

> **SUPERSEDED.** The approach below (Removals tool / 404 flush) was **not**
> taken. The `crow-systems.github.io` host was restored as a **redirect
> bridge** to preserve rankings and authority: every old URL now 301-equivalent
> redirects to `crowsystems.com.mx`, and the migration is told to Google via
> **Change of Address** — not removals. See
> [Site hosting architecture](../explanation/site-hosting-architecture.md).
> This page is kept only as a record of the investigated (rejected) option.

## Goal

Get Google to stop showing `crow-systems.github.io` URLs. The host now returns
404 (the Pages site was removed), which is already the strongest removal
signal — these steps only make it faster.

Related context: [Site hosting architecture](../explanation/site-hosting-architecture.md).

## Why this works

- Google treats a **404/410 response** as the page being gone and drops it from
  the index on its own crawl schedule (days to a few weeks).
- The Google Search Console **removal tools** accelerate this by telling Google
  about a URL *now*, instead of waiting for the next crawl.
- Nothing in the old pages needs changing — the site does not exist anymore,
  so there is nothing to unpublish from within the site itself.

## What you need

- Access to the Google Search Console property **`crow-systems.github.io`**.
  - The old site carried a `google-site-verification` meta tag, so this
    property was likely verified while the site was live. Verification
    persists after the site is gone — check under *Settings → Users and
    permissions*.
  - If the property is gone, you cannot re-verify it now (the site is down;
    DNS for `*.github.io` isn't yours). In that case, skip to step 3 — the 404
    alone will clear you out.

## Steps

1. **Confirm the pages are really down** (optional sanity check):
   ```bash
   for u in https://crow-systems.github.io/ https://crow-systems.github.io/en/about/; do
     echo "$u -> $(curl -s -o /dev/null -w '%{http_code}' "$u")"
   done
   ```
   Expect `404`.

2. **Request removal for the root and any high-value URLs**
   (Google Search Console for `crow-systems.github.io`):
   - Go to *Indexing → Removals* → **New request**.
   - Choose **Remove outdated content** (for URLs that now return 404; Google
     verifies the 404 before removing). Add the URLs one at a time or batch:
     - `https://crow-systems.github.io/`
     - `https://crow-systems.github.io/en/`
     - `https://crow-systems.github.io/en/about/` (and any other URLs you
       remember were indexed)
   - For a *temporary* takedown (also removes soft-404 and near-identical
     pages, but re-applies after ~6 months) use **Temporary removals** →
     checkbox **Remove all URLs under this prefix** with prefix `/`.
   - The "outdated content" removal is the right default here because the
     content will never come back.

3. **Let the 404 crawl do the rest.** Do not submit a sitemap for
   `crow-systems.github.io` (there is none anymore); do not keep a stale one in
   that property.

4. **Verify in a few weeks:**
   ```bash
   # should return no results
   site:crow-systems.github.io
   ```
   And in URL Inspection on a removed URL, expect *"URL is not on Google"*.

## Current site

While the old host is being dropped, keep `sitemap.xml` and Request-Indexing
up to date on the **`crowsystems.com.mx`** property instead — that is the host
Google should keep, not remove.