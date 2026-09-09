# How to run the API locally for development and e2e tests

## Goal

Serve the web frontend against the **real backend API** running locally, so
form submissions and the e2e suite exercise production-equivalent code paths
instead of mocks. One command boots both.

## Prerequisites

- Docker available (the backend runs as a Compose stack in the sibling
  `api/` repo; web and API must be sibling directories).
- The web repo's dev-server proxy is configured (default setup, no edits
  needed) — see [Dev environment reference](../reference/dev-environment.md).

## Steps

1. **Start the API + web dev server** from the web repo root:

   ```bash
   bun run dev:all
   ```

   `dev:all` first brings up the backend stack idempotently
   (`docker compose -f ../api/docker-compose.yml up -d`), then starts
   `astro dev` on port 4321.

   Starting the pieces separately also works:

   ```bash
   bun run dev:api   # ensure the backend stack is up
   bun run dev       # web dev server on :4321
   ```

2. **Verify the API is reachable through the dev server** (same-origin, via the
   Vite proxy):

   ```bash
   curl -s http://localhost:4321/api/v1/health
   # {"success":true,"message":"ok",...}
   ```

   A `200` here means forms and tests will reach the backend.

3. **Run the e2e suite**:

   ```bash
   bun run test:e2e
   ```

   Playwright spawns `bun run dev --port 4321` itself if it isn't running.
   Each happy-path run creates real lead records in the backend, named with an
   `E2E ...` prefix and a timestamp so they are identifiable.

## After changing the API

The Compose stack does not watch the API repo's source. After editing API code
(or its routes/schema), rebuild and restart before re-testing:

```bash
docker compose -f ../api/docker-compose.yml --project-directory ../api up -d --build
```

## Alternatives

- **Production API**: without `dev:api`, the dev proxy still targets the
  tunnel (`https://crowsys.chrislabs.net`), i.e. the same backend that serves
  production. Run `dev:all` only when you want to make sure the local stack is
  the one being exercised.
- **Mocks**: not supported — the suite is written against the real backend.

Related: [Dev environment reference](../reference/dev-environment.md) ·
[Why development reaches the API through a proxy](../explanation/networking-stack.md#development-traffic-reaches-the-api-through-a-proxy)