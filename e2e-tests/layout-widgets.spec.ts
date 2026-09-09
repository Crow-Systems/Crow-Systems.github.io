import { test, expect, type Page } from '@playwright/test';

// nav services dropdown (desktop)
async function openDesktopServices(page: Page) {
  await page.goto('/');
  await page.locator('[data-services-area]').hover();
  await page.locator('#services-submenu').waitFor({ state: 'visible' });
}

// mobile menu (hamburger)
async function openMobileMenu(page: Page) {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await page.locator('#menu-btn').click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
}

test('desktop services dropdown opens on hover and lists services', async ({ page }) => {
  await openDesktopServices(page);
  const panel = page.locator('#services-submenu');
  await expect(panel).toBeVisible();
  // the "all services" link plus the six service anchors
  await expect(panel.locator('a[data-services-link]')).toHaveCount(7);
  await expect(panel.locator('a[data-umami-event="nav-services-all"]')).toBeVisible();
});

test('desktop services dropdown closes on Escape', async ({ page }) => {
  await openDesktopServices(page);
  const panel = page.locator('#services-submenu');
  await expect(panel).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
});

test('desktop services dropdown navigates to a service anchor', async ({ page }) => {
  await openDesktopServices(page);
  await page
    .locator('#services-submenu a[data-umami-event="nav-service-item"]')
    .first()
    .click();
  await expect(page).toHaveURL(/\/servicios\/?#.+/, { timeout: 7000 });
});

test('mobile menu opens and closes via hamburger', async ({ page }) => {
  await openMobileMenu(page);
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.locator('#menu-btn').click();
  await expect(page.locator('#mobile-menu')).toBeHidden();
});

test('mobile menu closes after tapping a nav link', async ({ page }) => {
  await openMobileMenu(page);
  await page.locator('#mobile-menu a[data-umami-event="mobile-nav-about"]').click();
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expect(page).toHaveURL(/\/nosotros\/?$/);
});

test('mobile menu shows the six service links in the submenu', async ({ page }) => {
  await openMobileMenu(page);
  await page.locator('#mobile-menu [data-mobile-services-toggle]').click();
  const submenu = page.locator('#mobile-services-submenu');
  await expect(submenu).toBeVisible();
  await expect(submenu.locator('a[data-mobile-services-link]')).toHaveCount(7);
});

test('whatsapp fab opens the chat card on click', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('#whatsapp-card');
  await expect(card).toBeHidden();
  await page.locator('#whatsapp-fab').click();
  await expect(card).toBeVisible();
});

test('whatsapp card closes on Escape and returns focus to the fab', async ({ page }) => {
  await page.goto('/');
  await page.locator('#whatsapp-fab').click();
  await expect(page.locator('#whatsapp-card')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#whatsapp-card')).toBeHidden();
  await expect(page.locator('#whatsapp-fab')).toBeFocused();
});

test('whatsapp suggestion fills the message and updates the send link', async ({ page }) => {
  await page.goto('/');
  await page.locator('#whatsapp-fab').click();
  const firstPill = page.locator('[data-whatsapp-suggestion]').first();
  const suggestion = await firstPill.getAttribute('data-whatsapp-suggestion');
  await firstPill.click();
  const msg = page.locator('#whatsapp-msg');
  await expect(msg).toHaveValue(suggestion ?? '');
  const href = await page.locator('#whatsapp-send').getAttribute('href');
  expect(href).toContain(encodeURIComponent(suggestion ?? ''));
});

test('whatsapp send is blocked for an empty message', async ({ page }) => {
  await page.goto('/');
  await page.locator('#whatsapp-fab').click();
  // clear the default message
  const msg = page.locator('#whatsapp-msg');
  await msg.fill('');
  await page.locator('#whatsapp-send').click();
  // focus stays in the textarea, card still open
  await expect(msg).toBeFocused();
  await expect(page.locator('#whatsapp-card')).toBeVisible();
});

test('whatsapp badge shows when the message changed and card is hidden', async ({ page }) => {
  await page.goto('/');
  const badge = page.locator('#whatsapp-badge');
  await expect(badge).toBeHidden();
  // open, type, close — leaves a pending change
  await page.locator('#whatsapp-fab').click();
  await page.locator('#whatsapp-msg').fill('Hola, quiero información');
  await page.locator('#whatsapp-fab').click();
  await expect(badge).toBeVisible();
});