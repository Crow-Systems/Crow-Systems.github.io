import { test, expect } from '@playwright/test';
import { clearDrafts } from './helpers';

const SUBMIT = '[data-umami-event="consulting-form-submit"]';
const WRITE_MODE = '[data-umami-event="consulting-mode-toggle"][data-umami-event-mode="write"]';
const RECORD_TOGGLE = '[data-umami-event="audio-recorder-toggle"]';

test('text mode submission reaches the backend, shows success and clears the form', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto('/consultoria/');
  await clearDrafts(page);
  await page.goto('/consultoria/');

  await page.click(WRITE_MODE);

  const fullName = `E2E Consultoria ${Date.now()}`;
  const problem =
    'Necesito automatizar el proceso de facturación de mi empresa e integrarlo con el CRM.';

  const responsePromise = page.waitForResponse(
    (res) =>
      res.url().includes('/consultation') && res.request().method() === 'POST',
  );
  await page.fill('#cf-name', fullName);
  await page.fill('#cf-phone', '+52 55 1234 5678');
  await page.fill('#cf-email', `e2e-consulting-${Date.now()}@example.com`);
  await page.fill('#cf-company', 'Empresa E2E');
  await page.fill('#cf-description', problem);
  await page.click(SUBMIT);

  const response = await responsePromise;
  expect(response.ok()).toBeTruthy();
  expect(response.request().postDataJSON()).toEqual({
    fullName,
    company: 'Empresa E2E',
    email: expect.stringContaining('@example.com'),
    phone: expect.stringContaining('52'),
    businessProblem: problem,
  });

  await expect(page.locator('[role="status"]')).toContainText(
    'Tu solicitud ha sido enviada',
  );
  await expect(page.locator('#cf-name')).toHaveValue('');
  await expect(page.locator('#cf-phone')).toHaveValue('');
  expect(await page.evaluate(() => localStorage.getItem('consulting-draft'))).toBeNull();

  expect(pageErrors).toEqual([]);
});

test('text mode validation catches empty name, phone and short description', async ({
  page,
}) => {
  await page.goto('/consultoria/');
  await clearDrafts(page);
  await page.goto('/consultoria/');

  await page.click(WRITE_MODE);
  await page.fill('#cf-description', 'corto');
  await page.click(SUBMIT);

  await expect(page.locator('#cf-name-err')).toContainText(
    'El nombre debe tener al menos 2 caracteres',
  );
  await expect(page.locator('#cf-phone-err')).toContainText(
    'El número de teléfono es obligatorio',
  );
  await expect(page.locator('#cf-description-err')).toContainText(
    'Describe tu proyecto en al menos 10 caracteres',
  );
});

test('audio mode submission reaches the backend, shows success and resets recorder', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto('/consultoria/');
  await clearDrafts(page);
  await page.goto('/consultoria/');

  await page.click(RECORD_TOGGLE);
  await page.waitForTimeout(2_000);
  await page.click(RECORD_TOGGLE);

  await page.fill('#cf-name', `E2E Audio ${Date.now()}`);
  await page.fill('#cf-phone', '+52 55 1234 5678');

  const responsePromise = page.waitForResponse(
    (res) =>
      res.url().includes('/audio/upload') && res.request().method() === 'POST',
  );
  await page.click(SUBMIT);

  const response = await responsePromise;
  expect(response.ok()).toBeTruthy();

  await expect(page.locator('[role="status"]')).toContainText(
    'Tu audio ha sido enviado',
  );
  await expect(page.locator('#cf-name')).toHaveValue('');
  expect(await page.evaluate(() => localStorage.getItem('consulting-draft'))).toBeNull();

  expect(pageErrors).toEqual([]);
});

test('audio mode submit without a recording shows the audio-required alert', async ({
  page,
}) => {
  await page.goto('/consultoria/');
  await clearDrafts(page);
  await page.goto('/consultoria/');

  await page.fill('#cf-name', 'Sin Audio E2E');
  await page.fill('#cf-phone', '+52 55 1234 5678');
  await page.click(SUBMIT);

  await expect(page.locator('[role="alert"]')).toContainText(
    'Por favor, graba audio primero.',
  );
});