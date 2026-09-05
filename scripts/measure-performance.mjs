import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.DIST || fileURLToPath(new URL('../dist/', import.meta.url));
const PORT = 4173;
const PATH = process.env.URL || '/';
const CHROME =
  process.env.CHROME || process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.txt': 'text/plain',
};

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  try {
    const data = await readFile(join(ROOT, normalize(p)));
    res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    const data = await readFile(join(ROOT, '404.html'));
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end(data);
  }
});
await new Promise(r => server.listen(PORT, r));

// ponytail: single-run deterministic proxy for a slow mobile connection.
const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const cdp = await page.context().newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 150,                                // 3G-ish RTT
  downloadThroughput: (1.6 * 1e6) / 8,          // 1.6 Mbps
  uploadThroughput: (750 * 1e3) / 8,
});
await page.addInitScript(() => {
  window.__lcp = null;
  window.__lcpEl = '';
  if ('PerformanceObserver' in window) {
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__lcp = Math.round(e.startTime);
          window.__lcpEl = e.element?.id
            ? `${e.element.tagName.toLowerCase()}#${e.element.id}`
            : e.element?.tagName?.toLowerCase() || '';
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {}
  }
});
await page.goto(`http://localhost:${PORT}${PATH}`, { waitUntil: 'networkidle' });

const m = await page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const paint = Object.fromEntries(
    performance.getEntriesByType('paint').map(e => [e.name, Math.round(e.startTime)]),
  );
  return {
    ttfb: Math.round(nav.responseStart),
    fcp: paint['first-contentful-paint'] ?? null,
    lcp: window.__lcp,
    lcpElement: window.__lcpEl,
    domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
    load: Math.round(nav.loadEventEnd),
    resources: performance
      .getEntriesByType('resource')
      .map(r => ({
        name: decodeURIComponent(r.name).split('/').pop().slice(0, 60),
        start: Math.round(r.startTime),
        dur: Math.round(r.duration),
        encoded: r.encodedBodySize,
      }))
      .sort((a, b) => a.start - b.start),
  };
});

console.log(JSON.stringify(m, null, 2));
await browser.close();
server.close();
process.exit(0);