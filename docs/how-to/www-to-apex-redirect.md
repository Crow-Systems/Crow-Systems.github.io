# How to redirect www → apex (301)

## Goal

Make every `https://www.crowsystems.com.mx/…` request return a **301
Permanent Redirect** to `https://crowsystems.com.mx/…` (same path and query),
so there is one canonical host. All steps are in the Cloudflare dashboard.

## Prerequisites

- Access to the `crowsystems.com.mx` zone on Cloudflare.
- The apex already resolves: `dig +short crowsystems.com.mx A` returns
  Cloudflare anycast IPs and `https://crowsystems.com.mx/` returns 200.

## Steps

1. **Add the `www` DNS record** (DNS → Records → Add):
   - Type `CNAME`, Name `www`, Target `crowsystems.com.mx`
   - Proxy status: **Proxied** (orange cloud) — required, otherwise the
     redirect rule below never sees the request.
   - Alternatively use a proxied `A` record with a placeholder like
     `192.0.2.1` (see [Networking stack](../explanation/networking-stack.md)).
   - Confirm: `dig +short www.crowsystems.com.mx` returns Cloudflare IPs.
     A `000`/empty result in `curl` means this record is still missing.

2. **Create the redirect rule** (Rules → Redirect Rules → Create Rule):
   - Rule name: `www → apex 301`
   - If incoming requests match: **Wildcard pattern**
   - Request URL: `https://www.crowsystems.com.mx/*`
   - Target URL: `https://crowsystems.com.mx/${1}`
   - Status code: **301 - Permanent Redirect**
   - Redirect POST requests: leave unchecked.

3. **Verify**:
   ```bash
   curl -sI https://www.crowsystems.com.mx/            # → 301, Location: https://crowsystems.com.mx/
   curl -sI https://www.crowsystems.com.mx/en/about/   # → 301, Location: https://crowsystems.com.mx/en/about/
   curl -sI "https://www.crowsystems.com.mx/?x=1"      # → 301, Location keeps ?x=1
   ```

## Why the wildcard form

`${1}` is defined by the `*` in the Request URL: it captures everything after
the slash, so `/en/about/` becomes `https://crowsystems.com.mx/en/about/`.
Using `${1}` without a `*` yields an empty replacement; targeting
`https://www…/${1}` (same host) would self-redirect and loop.

## Notes

- Only after the redirect works can you rely on `www` as a safe alternate
  hostname; before that, keep Google pointing at the apex
  (see [Site hosting architecture](../explanation/site-hosting-architecture.md)).
- Record values, checks, and failure modes: [DNS records & tunnel](../reference/dns-records.md).