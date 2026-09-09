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