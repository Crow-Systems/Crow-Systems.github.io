import { defineConfig } from '@playwright/test';

// By default the suite runs against the local dev server, which is started
// with `--mode dev` so Vite loads `.env.dev` (a copy of `.env.example`).
// Point the suite at a deployed environment instead (full CSP + /umami
// proxy chain) with:
//   PLAYWRIGHT_BASE_URL=https://crowsystems.com.mx bun run test:e2e
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './e2e-tests',
  timeout: 30_000,
  fullyParallel: true,
  workers: 3,
  reporter: 'list',
  use: {
    baseURL: externalBaseURL ?? 'http://localhost:4321',
    trace: 'retain-on-failure',
    launchOptions: {
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
      ],
    },
    permissions: ['microphone'],
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'bun run dev --mode dev --port 4321',
        url: 'http://localhost:4321',
        reuseExistingServer: true,
        timeout: 60_000,
      },
});