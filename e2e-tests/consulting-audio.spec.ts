import { test, expect, type Page } from '@playwright/test';
import { clearDrafts, waitForHydration } from './helpers';

declare global {
  interface Window {
    __origCtx?: typeof AudioContext;
    __ctxResumeBlocked?: boolean;
  }
}

const RECORD_TOGGLE = '[data-umami-event="audio-recorder-toggle"]';
const PLAY_TOGGLE = '[data-umami-event="audio-playback-toggle"]';
const DELETE_TOGGLE = '[data-umami-event="audio-recorder-delete"]';

// true once the audio draft is actually written to IndexedDB
async function audioDraftSaved(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase | null>((resolve) => {
      const req = indexedDB.open('cs-drafts', 1);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
    if (!db) return false;
    try {
      return await new Promise<boolean>((resolve) => {
        const req = db
          .transaction('audio', 'readonly')
          .objectStore('audio')
          .get('consulting-draft');
        req.onsuccess = () => {
          const rec: { blob?: Blob } | undefined = req.result;
          resolve(Boolean(rec?.blob && rec.blob.size > 0));
        };
        req.onerror = () => resolve(false);
      });
    } finally {
      db.close();
    }
  });
}

// first token of the mono time display, e.g. "00:01 / 00:02" -> number of seconds
async function elapsedSeconds(page: Page) {
  const text = (await page.locator('.font-mono').textContent()) ?? '';
  const token = text.split('/')[0]?.trim() ?? '00:00';
  const [m, s] = token.split(':').map(Number);
  return m * 60 + s;
}

// total duration, the second token of the mono time display
async function totalSeconds(page: Page) {
  const text = (await page.locator('.font-mono').textContent()) ?? '';
  const token = text.split('/')[1]?.trim() ?? '00:00';
  const [m, s] = token.split(':').map(Number);
  return m * 60 + s;
}

async function elapsedTime(page: Page) {
  const seconds = await elapsedSeconds(page);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

test('recorded audio persists and plays back after a reload', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto('/consultoria/');
  await clearDrafts(page);
  await page.goto('/consultoria/');
  await waitForHydration(page);

  // elapsed ticks while recording (not just during playback)
  await page.click(RECORD_TOGGLE);
  await expect
    .poll(() => elapsedSeconds(page), { timeout: 5_000 })
    .toBeGreaterThanOrEqual(2);
  await page.click(RECORD_TOGGLE);

  // recorded duration is shown as total, elapsed starts at 00:00 (00:00 / 00:0X)
  const recordedSeconds = await totalSeconds(page);
  await expect(recordedSeconds).toBeGreaterThanOrEqual(2);
  await expect.poll(() => elapsedSeconds(page)).toBe(0);

  // in-session playback advances
  await page.click(PLAY_TOGGLE);
  await expect.poll(() => elapsedSeconds(page), { timeout: 4_000 }).toBeGreaterThan(0);
  await page.click(PLAY_TOGGLE); // pause

  // let the draft persist, then reload
  await expect
    .poll(() => audioDraftSaved(page), { timeout: 5_000 })
    .toBe(true);
  await page.reload({ waitUntil: 'networkidle' });

  // the total shows the same recorded length after reload (00:00 / 00:0X)
  await expect.poll(() => totalSeconds(page), { timeout: 4_000 }).toBe(recordedSeconds);
  await expect.poll(() => elapsedSeconds(page)).toBe(0);

  // the stored blob was restored: delete opens the confirm dialog
  await page.click(DELETE_TOGGLE);
  await expect(page.locator('[role="alertdialog"]')).toBeVisible();
  await page.keyboard.press('Escape');

  // playback works again after reload
  await page.click(PLAY_TOGGLE);
  await expect.poll(() => elapsedSeconds(page), { timeout: 4_000 }).toBeGreaterThan(0);

  expect(pageErrors).toEqual([]);
});

test('tab switch (audio -> text -> audio) keeps the recording', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto('/consultoria/');
  await clearDrafts(page);
  await page.goto('/consultoria/');
  await waitForHydration(page);

  await page.click(RECORD_TOGGLE);
  await expect
    .poll(() => elapsedSeconds(page), { timeout: 5_000 })
    .toBeGreaterThanOrEqual(2);
  await page.click(RECORD_TOGGLE);

  await page.click('[data-umami-event="consulting-mode-toggle"][data-umami-event-mode="write"]');
  await page.click('[data-umami-event="consulting-mode-toggle"][data-umami-event-mode="audio"]');

  // the recording survived the roundtrip: delete prompts to discard it
  await page.click(DELETE_TOGGLE);
  await expect(page.locator('[role="alertdialog"]')).toBeVisible();
  await page.keyboard.press('Escape');

  expect(pageErrors).toEqual([]);
});

test('playback works after reload while audio was playing', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto('/consultoria/');
  await clearDrafts(page);
  await page.goto('/consultoria/');
  await waitForHydration(page);

  await page.click(RECORD_TOGGLE);
  await expect
    .poll(() => elapsedSeconds(page), { timeout: 5_000 })
    .toBeGreaterThanOrEqual(2);
  await page.click(RECORD_TOGGLE);

  // recorded duration is shown as total
  const recordedSeconds = await totalSeconds(page);

  // play in-session and leave it playing
  await page.click(PLAY_TOGGLE);
  await expect.poll(() => elapsedSeconds(page), { timeout: 4_000 }).toBeGreaterThan(0);

  // reload while playback is still going
  await expect
    .poll(() => audioDraftSaved(page), { timeout: 5_000 })
    .toBe(true);
  await page.reload({ waitUntil: 'networkidle' });

  // wait for the draft to be restored before interacting again
  await expect
    .poll(() => totalSeconds(page), { timeout: 4_000 })
    .toBe(recordedSeconds);

  // play again after reload
  await page.click(PLAY_TOGGLE);
  await expect.poll(() => elapsedSeconds(page), { timeout: 4_000 }).toBeGreaterThan(0);

  expect(pageErrors).toEqual([]);
});

test('playback still works when AudioContext cannot resume (autoplay blocked)', async ({ page }) => {
  // Simulates the documented Chrome/WebKit failure where AudioContext.resume()
  // rejects/stays suspended after a reload, which would mute an element that is
  // routed through the WebAudio graph. Playback must fall back to native output.
  await page.addInitScript(() => {
    const NativeCtx = window.AudioContext;
    if (!window.__origCtx) window.__origCtx = NativeCtx;
    window.AudioContext = function (contextOptions?: AudioContextOptions) {
      const ctx = new (window.__origCtx ?? NativeCtx)(contextOptions);
      Object.defineProperty(ctx, 'state', { get: () => 'suspended' });
      ctx.resume = () =>
        window.__ctxResumeBlocked
          ? Promise.reject(
              new DOMException('simulated autoplay policy block', 'NotAllowedError'),
            )
          : Promise.resolve();
      return ctx;
    } as unknown as typeof window.AudioContext;
    window.AudioContext.prototype = (window.__origCtx).prototype;
  });

  await page.goto('/consultoria/');
  await clearDrafts(page);
  await page.goto('/consultoria/');
  await waitForHydration(page);

  await page.click(RECORD_TOGGLE);
  await expect
    .poll(() => elapsedSeconds(page), { timeout: 5_000 })
    .toBeGreaterThanOrEqual(2);
  await page.click(RECORD_TOGGLE);

  // recorded duration is shown as total
  const recordedSeconds = await totalSeconds(page);

  // let the draft persist, then reload
  await expect
    .poll(() => audioDraftSaved(page), { timeout: 5_000 })
    .toBe(true);
  await page.reload({ waitUntil: 'networkidle' });

  // wait for the draft to be restored before interacting again
  await expect
    .poll(() => totalSeconds(page), { timeout: 4_000 })
    .toBe(recordedSeconds);

  // block AudioContext.resume() from now on
  await page.evaluate(() => {
    window.__ctxResumeBlocked = true;
  });

  // playback must still advance (native output path)
  await page.click(PLAY_TOGGLE);
  await expect.poll(() => elapsedSeconds(page), { timeout: 4_000 }).toBeGreaterThan(0);
});

test('corrupted persisted recording fails playback gracefully after reload', async ({ page }) => {
  // Simulates browsers whose MediaRecorder produces a broken file (open WebKit
  // regressions on Safari/iOS 26). A restored corrupt blob must not surface as
  // an unhandled DOMException from play(); show feedback instead.
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto('/consultoria/');
  await clearDrafts(page);

  // seed a corrupt blob directly into IndexedDB
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('cs-drafts', 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains('audio')) {
          req.result.createObjectStore('audio');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('audio', 'readwrite');
      tx.objectStore('audio').put(
        {
          savedAt: Date.now(),
          blob: new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], {
            type: 'audio/webm',
          }),
        },
        'consulting-draft',
      );
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  });

  await page.reload({ waitUntil: 'networkidle' });

  // wait for the corrupt draft to be restored: the total flips from the
  // 05:00 placeholder to 00:00 (no duration can be read from the blob)
  await expect.poll(() => totalSeconds(page), { timeout: 4_000 }).toBe(0);

  await page.click(PLAY_TOGGLE);

  // graceful feedback, no playback start, no unhandled DOMException
  await expect(page.locator('[role="alert"]')).toBeVisible();
  await expect.poll(() => elapsedTime(page)).toBe('00:00');
  expect(pageErrors).toEqual([]);
});