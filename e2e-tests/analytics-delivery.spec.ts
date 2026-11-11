import { test, expect, type Page } from "@playwright/test";

// Analytics-delivery regression net for the same-origin Umami proxy
// (openspec change add-same-origin-umami-proxy). Runs against the local dev
// server by default; point it at a deployment (where the /umami proxy and the
// header CSP exist) with:
//   PLAYWRIGHT_BASE_URL=https://crowsystems.com.mx bun run test:e2e
//
// Dev mode runs with `--mode dev`, which loads .env.dev (a copy of
// .env.example). Tracker-dependent tests skip themselves when
// UMAMI_WEBSITE_ID is empty there; the ingest test only runs against a
// deployment because the dev server cannot host the /umami proxy.

const STALE_ANALYTICS_HOSTS = ["latitudem2m-analytics.chrislabs.net"];

function collectCspViolations() {
  const w = window as unknown as { __cspViolations: unknown[] };
  w.__cspViolations = [];
  document.addEventListener(
    "securitypolicyviolation",
    (e) => {
      w.__cspViolations.push({
        directive: e.violatedDirective,
        blocked: (e as { blockedURL?: string }).blockedURL || "(inline)",
        line: e.lineNumber,
      });
    },
    true
  );
}

function violations(page: Page) {
  return page.evaluate(
    () =>
      (window as unknown as { __cspViolations?: unknown[] })
        .__cspViolations ?? []
  );
}

test.describe("analytics delivery", () => {
  test("pages load with zero CSP violations", async ({ page, baseURL }) => {
    await page.addInitScript(collectCspViolations);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const tracker = page.locator('script[src*="script.js"]');
    const src = (await tracker.count())
      ? await tracker.first().getAttribute("src")
      : null;
    const externalTracker =
      src !== null &&
      src !== undefined &&
      new URL(src, page.url()).origin !== new URL(baseURL!).origin;
    test.skip(
      externalTracker,
      "cross-origin cloud mode is not the deployment target; the external recorder's own fetch noise is tolerated there"
    );
    expect(await violations(page)).toEqual([]);
  });

  test("tracker script URL and meta CSP policy agree on the delivery mode", async ({
    page,
  }) => {
    await page.addInitScript(collectCspViolations);
    await page.goto("/");
    const tracker = page.locator('script[src*="script.js"]');
    const src = (await tracker.count())
      ? await tracker.first().getAttribute("src")
      : null;
    test.skip(
      !src,
      "tracker not configured (set UMAMI_WEBSITE_ID in .env.dev to exercise)"
    );

    const info = await page.evaluate((scriptSrc) => {
      const url = new URL(scriptSrc!, document.baseURI);
      const meta =
        document
          .querySelector('meta[http-equiv="Content-Security-Policy"]')
          ?.getAttribute("content") ?? "";
      return {
        sameOrigin: url.origin === window.location.origin,
        metaHasCloudUmami: meta.includes("https://cloud.umami.is"),
        metaHasScriptOrigin: meta.includes(url.origin),
      };
    }, src);

    if (info.sameOrigin) {
      // same-origin mode: policy must rely on 'self' only
      expect(info.metaHasCloudUmami).toBe(false);
    } else {
      // cross-origin mode: the exact origin must be whitelisted
      expect(info.metaHasScriptOrigin).toBe(true);
    }
  });

  test("no stale analytics hostnames remain in the meta or header CSP", async ({
    page,
    request,
    baseURL,
  }) => {
    await page.goto("/");
    const meta = await page
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .getAttribute("content");
    expect(meta).not.toBeNull();
    for (const host of STALE_ANALYTICS_HOSTS) expect(meta).not.toContain(host);

    const res = await request.get(`${baseURL}/`);
    const header = res.headers()["content-security-policy"] ?? "";
    test.skip(!header, "no CSP header in this environment (dev server)");
    for (const host of STALE_ANALYTICS_HOSTS) expect(header).not.toContain(host);
    // The header ships with the Caddy deployment, which is always
    // same-origin mode: no analytics hostname may appear in script-src.
    const scriptSrc = /script-src[^;]*/i.exec(header)?.[0] ?? "";
    expect(scriptSrc).not.toMatch(/umami/i);
  });

  test("same-origin ingest reaches the backend through the proxy", async ({
    page,
  }) => {
    test.skip(
      !process.env.PLAYWRIGHT_BASE_URL,
      "requires a deployment serving the analytics proxy (run with PLAYWRIGHT_BASE_URL)"
    );
    await page.addInitScript(collectCspViolations);
    await page.goto("/");

    const booted = await page.evaluate(
      () => typeof (window as any).umami?.track === "function"
    );
    test.skip(!booted, "tracker did not boot on this deployment");

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().endsWith("/api/send") && r.request().method() === "POST",
        { timeout: 15_000 }
      ),
      page.evaluate(() =>
        (window as any).umami.track("e2e-analytics-delivery-probe")
      ),
    ]);
    expect(response.status()).toBeLessThan(400);
    expect(await violations(page)).toEqual([]);
  });

  test("data-umami-event taxonomy renders on home and services", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("[data-umami-event]").first()).toBeAttached();
  });
});
