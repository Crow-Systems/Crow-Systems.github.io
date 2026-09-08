# DNS records & tunnel (Reference)

Zone: `crowsystems.com.mx` — hosted on Cloudflare (nameservers
`norm.ns.cloudflare.com`, `harlee.ns.cloudflare.com`). All records below are
**proxied** (orange cloud) unless stated. Managed in the Cloudflare dashboard
(DNS → Records), not in this repo.

## Records

| Type | Name | Value | Proxy | Status |
|---|---|---|---|---|
| A / AAAA | `crowsystems.com.mx` | Cloudflare edge anycast (e.g. `172.67.x.x`, `104.21.x.x` + AAAA equivalents) | Proxied | **Required — restored** |
| CNAME | `www.crowsystems.com.mx` | `crowsystems.com.mx` (or proxied `A → 192.0.2.1`) | Proxied | **Pending — currently missing** |

> Why `192.0.2.1` and the tunnel CNAME are valid values: see
> [Networking stack](../explanation/networking-stack.md). Exact proxy IPs
> change; always verify with `dig` (below), never hardcode.

## Cloudflare Tunnel

- Tunnel ID: `10341301-6505-4102-bdd4-00fe7d0b7926` (also in
  `.cloudflare/config.yml`)
- Ingress:
  - `crowsystems.com.mx` → `http://app:80` (only hostname served)
  - catch-all → `http_status:404`
  - `www` is **edge-only**: it resolves to Cloudflare, the redirect rule 301s
    to the apex, and it is deliberately not in the tunnel ingress.

## Redirect rule (www → apex)

Single Redirect, applied at the edge:

- Match: **Wildcard pattern**
- Request URL: `https://www.crowsystems.com.mx/*`
- Target URL: `https://crowsystems.com.mx/${1}` (or custom-filter form:
  `(http.host eq "www.crowsystems.com.mx")` → dynamic
  `https://crowsystems.com.mx${http.request.uri.path}`)
- Status: `301 - Permanent Redirect`
- Redirect POST requests: off

## Verification

```bash
# DNS
dig +short crowsystems.com.mx A        # expect Cloudflare anycast IP(s)
dig +short www.crowsystems.com.mx      # expect Cloudflare anycast IP(s)

# Redirect
curl -sI https://www.crowsystems.com.mx/            # 301, Location: https://crowsystems.com.mx/
curl -sI https://www.crowsystems.com.mx/en/about/   # 301, Location: https://crowsystems.com.mx/en/about/
curl -sI "https://www.crowsystems.com.mx/?x=1"      # 301, Location keeps ?x=1

# Apex still serves
curl -s -o /dev/null -w "%{http_code}\n" https://crowsystems.com.mx/robots.txt  # 200
```

Expected failure modes: `000` on www = no DNS record; 404 on apex = record
missing or tunnel ingress wrong.

Related: [Networking stack](../explanation/networking-stack.md)