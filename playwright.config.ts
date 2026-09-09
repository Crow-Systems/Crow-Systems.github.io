import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests',
  timeout: 30_000,
  fullyParallel: true,
  workers: 3,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
    launchOptions: {
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
      ],
    },
    permissions: ['microphone'],
  },
  webServer: {
    command: 'bun run dev --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});