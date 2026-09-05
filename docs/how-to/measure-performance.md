# How to measure page performance deterministically

## Goal

Measure First Contentful Paint (FCP), Largest Contentful Paint (LCP), and
resource-loading behavior of the built site, with the same throttled conditions
every run so before/after numbers are comparable.

## Prerequisites

- The site builds (`bun run build`).
- A Chromium executable is available. The script looks for one in, in order:
  1. the `CHROME` environment variable
  2. the `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` environment variable
  3. Playwright's default browser cache (`~/.cache/ms-playwright`)

If you don't have a browser, install one:

```bash
bunx playwright install chromium-headless-shell
```

## Steps

1. **Build the site** (the script serves `dist/`, so build first):
   ```bash
   bun run build
   ```

2. **Run the measurement**:
   ```bash
   bun run measure
   ```
   This rebuilds and measures `/` under a throttled 3G-like connection.

3. **Read the output**. The JSON printed includes `ttfb`, `fcp`, `lcp`, and
   `lcpElement` (which element is the LCP candidate). A full resource timeline
   follows so you can see *why* LCP is late (render-blocking CSS, slow font,
   late-discovered image).

4. **Measure a different route**:
   ```bash
   URL=/servicios/ bun run measure
   ```

## Comparing before/after

Run once, apply a change, run again. Keep the same `URL`, `CHROME`, and
network (the script fixes latency/throughput), so the only variable is your
change.

## Next step

For a full Lighthouse audit (scores, throttling identical to Lighthouse's
mobile preset), see `docs/reference/performance-script.md` for Unlighthouse
usage.