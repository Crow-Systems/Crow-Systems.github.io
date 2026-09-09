import { test, expect } from '@playwright/test';
import { waitForHydration } from './helpers';

const S = {
  contactSubmit: '[data-umami-event="contact-form-submit"]',
  consultingSubmit: '[data-umami-event="consulting-form-submit"]',
  writeMode: '[data-umami-event="consulting-mode-toggle"][data-umami-event-mode="write"]',
  networkBanner: '[role="alert"]',
  dismiss: 'button[aria-label="Dismiss error"]',
};

// errorType: "network" | "server" | "unknown"
// When errorType is "network", the route is aborted (fetch throws TypeError).

async function contactError(page: Parameters<typeof test>[0]['page'], errorType: 'network' | 'server' | 'unknown') {
  const url = '**/api/v1/contact';
  if (errorType === 'network') {
    await page.route(url, (route) => route.abort());
  } else {
    const errorKey =
      errorType === 'server' ? 'SERVER_INTERNAL_ERROR' : 'SOMETHING_UNKNOWN';
    await page.route(url, (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, errorKey }),
      }),
    );
  }
  await page.goto('/contacto/');
  // React hydrates lazily; Astro stamps client-render-time only after hydration.
  // Wait for it so the onSubmit handler is bound before we click.
  await waitForHydration(page);
  await page.fill('#cnt-name', 'E2E Error');
  await page.fill('#cnt-email', 'e2e@example.com');
  await page.fill('#cnt-subject', 'Prueba');
  await page.fill('#cnt-message', 'Mensaje valido de prueba para error.');
  await page.click(S.contactSubmit);
}

test('contact form shows a banner on network failure', async ({ page }) => {
  await contactError(page, 'network');
  const banner = page.locator(S.networkBanner);
  await expect(banner).toBeVisible();
  await expect(banner).toContainText('No se puede conectar');
  await expect(page.locator(S.dismiss)).toBeVisible();
});

test('contact form shows the localized server error message', async ({ page }) => {
  await contactError(page, 'server');
  const banner = page.locator(S.networkBanner);
  await expect(banner).toBeVisible();
  await expect(banner).toContainText(
    'Algo salió mal. Por favor, inténtalo de nuevo en unos momentos.',
  );
});

test('contact form shows the raw key for unknown server errors', async ({ page }) => {
  await contactError(page, 'unknown');
  const banner = page.locator(S.networkBanner);
  await expect(banner).toBeVisible();
  await expect(banner).toContainText('SOMETHING_UNKNOWN');
});

test('contact form dismisses the error banner', async ({ page }) => {
  await contactError(page, 'server');
  const banner = page.locator(S.networkBanner);
  await expect(banner).toBeVisible();
  await page.locator(S.dismiss).click();
  await expect(banner).toBeHidden();
  // form is still usable after dismissing
  await expect(page.locator('#cnt-name')).toHaveValue('E2E Error');
});

test('contact form maps server field error to the field', async ({ page }) => {
  const url = '**/api/v1/contact';
  await page.route(url, (route) =>
    route.fulfill({
      status: 422,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        errorKey: 'VALIDATION_NAME_REQUIRED',
      }),
    }),
  );
  await page.goto('/contacto/');
  await waitForHydration(page);
  await page.fill('#cnt-name', 'E2E Error');
  await page.fill('#cnt-email', 'e2e@example.com');
  await page.fill('#cnt-subject', 'Prueba');
  await page.fill('#cnt-message', 'Mensaje valido de prueba para error.');
  await page.click(S.contactSubmit);

  // field-level error shown (id uses the cf- prefix from getFieldState), no banner
  // (the field error <p> also has role="alert", so assert on the absence of the dismiss button)
  await expect(page.locator('#cf-name-err')).toBeVisible();
  await expect(page.locator(S.dismiss)).toHaveCount(0);
});

async function consultingError(
  page: Parameters<typeof test>[0]['page'],
  errorType: 'network' | 'server' | 'unknown',
) {
  const url = '**/api/v1/consultation';
  if (errorType === 'network') {
    await page.route(url, (route) => route.abort());
  } else {
    const errorKey =
      errorType === 'server' ? 'SERVER_INTERNAL_ERROR' : 'SOMETHING_UNKNOWN';
    await page.route(url, (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, errorKey }),
      }),
    );
  }
  await page.goto('/consultoria/');
  await waitForHydration(page);
  await page.click(S.writeMode);
  await page.fill('#cf-name', 'E2E Error');
  await page.fill('#cf-phone', '+52 55 1234 5678');
  await page.fill('#cf-description', 'Mensaje valido de prueba para el error.');
  await page.click(S.consultingSubmit);
}

test('consulting form shows a banner on network failure', async ({ page }) => {
  await consultingError(page, 'network');
  const banner = page.locator(S.networkBanner);
  await expect(banner).toBeVisible();
  await expect(banner).toContainText('No se puede conectar');
});

test('consulting form shows the localized server error message', async ({ page }) => {
  await consultingError(page, 'server');
  const banner = page.locator(S.networkBanner);
  await expect(banner).toBeVisible();
  await expect(banner).toContainText(
    'Algo salió mal. Por favor, inténtalo de nuevo en unos momentos.',
  );
});

test('consulting form dismisses the error banner and allows resubmit', async ({ page }) => {
  await consultingError(page, 'server');
  const banner = page.locator(S.networkBanner);
  await expect(banner).toBeVisible();
  await page.locator(S.dismiss).click();
  await expect(banner).toBeHidden();

  // a second submit no longer hits the failing route: fulfill success instead
  await page.unrouteAll();
  await page.route('**/api/v1/consultation', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    }),
  );
  await page.click(S.consultingSubmit);
  await expect(page.locator('[role="status"]')).toContainText('Tu solicitud ha sido enviada');
});