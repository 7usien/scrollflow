import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  webServer: {
    command: 'node tests/fixtures/serve.mjs',
    url: 'http://localhost:4599',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:4599',
  },
});
