import { test, expect } from '@playwright/test';
import { clearDrafts, waitForHydration } from './helpers';

const SUBMIT = '[data-umami-event="contact-form-submit"]';

test('valid submission reaches the backend, shows success and clears fields and draft', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto('/contacto/');
  await clearDrafts(page);
  await page.goto('/contacto/');
  await waitForHydration(page);

  const name = `E2E Contacto ${Date.now()}`;
  const email = `e2e-contact-${Date.now()}@example.com`;
  const subject = 'Prueba E2E';
  const message =
    'Este es un mensaje de prueba e2e para validar el flujo completo.';

  const responsePromise = page.waitForResponse(
    (res) => res.url().includes('/contact') && res.request().method() === 'POST',
  );
  await page.fill('#cnt-name', name);
  await page.fill('#cnt-email', email);
  await page.fill('#cnt-subject', subject);
  await page.fill('#cnt-message', message);
  await page.click(SUBMIT);

  const response = await responsePromise;
  expect(response.ok()).toBeTruthy();
  expect(response.request().postDataJSON()).toEqual({
    name,
    email,
    subject,
    message,
  });

  await expect(page.locator('[role="status"]')).toContainText('¡Gracias!');
  await expect(page.locator('#cnt-name')).toHaveValue('');
  await expect(page.locator('#cnt-email')).toHaveValue('');
  expect(await page.evaluate(() => localStorage.getItem('contact-draft'))).toBeNull();

  expect(pageErrors).toEqual([]);
});

test('empty submit shows a field error for every field and focuses the first one', async ({
  page,
}) => {
  await page.goto('/contacto/');
  await clearDrafts(page);
  await page.goto('/contacto/');
  await waitForHydration(page);

  await page.click(SUBMIT);

  for (const id of ['#cf-name-err', '#cf-email-err', '#cf-subject-err', '#cf-message-err']) {
    await expect(page.locator(id)).toBeVisible();
  }
  await expect(page.locator('#cnt-name')).toBeFocused();
});

test('invalid email errors on blur and clears when corrected', async ({ page }) => {
  await page.goto('/contacto/');
  await clearDrafts(page);
  await page.goto('/contacto/');
  await waitForHydration(page);

  await page.fill('#cnt-email', 'no-es-un-correo');
  await page.locator('#cnt-email').blur();
  await expect(page.locator('#cf-email-err')).toHaveText(
    'Se requiere un correo electrónico válido',
  );

  await page.fill('#cnt-email', 'valido@example.com');
  await expect(page.locator('#cf-email-err')).toBeHidden();
});

test('draft persists across a reload and can be cleared', async ({ page }) => {
  await page.goto('/contacto/');
  await clearDrafts(page);
  await page.goto('/contacto/');
  await waitForHydration(page);

  await page.fill('#cnt-name', 'Borrador E2E');
  await page.fill('#cnt-email', 'borrador@example.com');
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => localStorage.getItem('contact-draft'))).not.toBeNull();

  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('[role="status"]')).toContainText(
    'Guardado en este dispositivo',
  );
  await expect(page.locator('#cnt-name')).toHaveValue('Borrador E2E');
  await expect(page.locator('#cnt-email')).toHaveValue('borrador@example.com');

  await page.getByRole('button', { name: 'Borrar borrador' }).click();
  await expect(page.locator('#cnt-name')).toHaveValue('');
  await expect(page.locator('#cnt-email')).toHaveValue('');
  expect(await page.evaluate(() => localStorage.getItem('contact-draft'))).toBeNull();
});