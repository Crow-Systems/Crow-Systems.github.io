# Performance measurement reference

Two tools measure the built site. Both require `bun run build` (or existing
`dist/`) first.

## `scripts/measure-performance.mjs`

Fast, single-metric probe. Runs in Chromium under a fixed network throttle
(150 ms latency, 1.6 Mbps down / 750 Kbps up) and prints JSON.

**Inputs**

| Environment variable | Default | Purpose |
|---|---|---|
| `CHROME` | none | Path to a Chromium binary |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` | none | Path to a Chromium binary |
| `DIST` | `<repo>/dist` | Directory to serve |
| `URL` | `/` | Route to measure |
| `PORT` | `4173` | Static server port |

Chromium resolution order: `CHROME`, then `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, then Playwright's cache.
If no binary is found (no `CHROME`/`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` set and the cache is missing the revision),
the script runs `node node_modules/playwright-core/cli.js install chromium` and retries the launch.
With an explicit `CHROME`, a failed launch is fatal — the script does not download a fallback.

**Output** (`bun run measure` or `node scripts/measure-performance.mjs`)

| Field | Meaning |
|---|---|
| `ttfb` | Time to first byte (ms) |
| `fcp` | First Contentful Paint (ms) |
| `lcp` | Largest Contentful Paint (ms) |
| `lcpElement` | Tag of the LCP element (e.g. `img`, `h1`) |
| `domContentLoaded` / `load` | Document timing (ms) |
| `resources[]` | Per-resource `start` (ms), `dur` (ms), `encoded` (bytes), sorted by start — shows discovery order and cost |

## Unlighthouse

Full Lighthouse audit with scores, run against the served `dist/`:

```bash
python3 -m http.server 4173 -d dist &
npx unlighthouse --site http://localhost:4173 --ci --no-cache
```

Lighthouse's mobile preset applies CPU ×4 and network throttling itself; the
local HTTP server keeps TTFB near zero.

**Reading results** — each route writes a report under
`.unlighthouse/<site-hash>/reports/<route>/lighthouse.json`. Key audits:
`first-contentful-paint`, `largest-contentful-paint`,
`render-blocking-insight`, `image-delivery-insight`, `unsized-images`.