# Networking stack (Explanation)

## What this site's network looks like

The site is a static build served by Caddy inside Docker. The server has **no
public inbound IP** — users never connect to it directly. Instead it rides a
**Cloudflare Tunnel**:

```
browser ──HTTPS──> Cloudflare edge (proxied DNS) ──tunnel──> cloudflared on host ──> Caddy (:80)
```

`cloudflared` opens an *outbound* connection to Cloudflare's edge and keeps it
alive. A request for a hostname whose proxied DNS record exists in the zone is
matched to this tunnel through the `ingress` rules in the tunnel config, which
deliver it to `http://app:80`.

## Why proxied DNS records are placeholders

For Cloudflare to handle `crowsystems.com.mx` it must exist as a **proxied**
(orange-cloud) DNS record in the zone. The value of that record is what users'
resolvers get back — but it can be a dummy, because the traffic flow never
touches it:

- **Users** resolve the hostname to Cloudflare anycast IPs (`172.67.x.x`,
  `104.21.x.x`).
- **Cloudflare** forwards to the origin over the tunnel, identified by
  hostname, not IP.

So the origin's real address is never exposed, and the record's literal value
only has to be *something*. Two idiomatic choices:

- `CNAME → <tunnel-id>.cfargotunnel.com` — Cloudflare's explicit "route this
  through tunnel X" target. Documents intent.
- `A → 192.0.2.1` — a placeholder. `192.0.2.0/24` is **TEST-NET-1**
  (RFC 5737): ranges reserved for documentation and guaranteed never to be
  routed in the real internet, so the dummy address is harmless. The edge
  never contacts it; the tunnel ignores it.

Both are equivalent when proxied. The CNAME form is preferred because it
says what the record is for; the A-placeholder form is fine when a CNAME is
awkward (e.g. the apex itself, where CNAME records are technically invalid).

## Why `www` needs its own record even though it redirects

The Cloudflare **redirect rule** for `www → crowsystems.com.mx` runs at the
**edge**, before the tunnel. It can only see requests that reach the edge —
and a request only reaches the edge if `www.crowsystems.com.mx` resolves to
it. That requires a proxied `www` record in the zone. The origin never serves
`www` content: the edge 301s to the apex without ever opening the tunnel.

## Two hostnames, one canonical host

`www.crowsystems.com.mx` is **edge-only**: it resolves to Cloudflare, and the
redirect rule 301s it to the apex — it has no entry in the tunnel ingress and
the origin never serves anything for it. Only `crowsystems.com.mx` reaches the
tunnel. One canonical host — the apex — matters for SEO (duplicate hosts split
the canonical signal; see
[Site hosting architecture](./site-hosting-architecture.md) for why a single
canonical is the whole point).

## Authority

The zone `crowsystems.com.mx` is hosted on Cloudflare nameservers
(`norm.ns.cloudflare.com`, `harlee.ns.cloudflare.com`); DNS edits are
dashboard/SDK operations on the zone, not repo changes.

Related: [DNS records reference](../reference/dns-records.md) ·
[How to redirect www → apex](../how-to/www-to-apex-redirect.md)