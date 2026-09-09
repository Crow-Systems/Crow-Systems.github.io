import type { Page } from '@playwright/test';

export async function clearDrafts(page: Page) {
  await page.evaluate(async () => {
    localStorage.clear();
    const req = indexedDB.deleteDatabase('cs-drafts');
    await new Promise((resolve) => {
      req.onsuccess = req.onerror = req.onblocked = resolve;
    });
  });
}

// React islands hydrate lazily; Astro stamps client-render-time only after
// hydration. Waiting for it prevents native form submission / dead clicks
// when an action fires before the onSubmit handler is bound.
export async function waitForHydration(page: Page, timeout = 20_000) {
  await page.waitForSelector('astro-island[client-render-time]', { timeout });
}