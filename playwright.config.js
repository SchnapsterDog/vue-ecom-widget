// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
  }
});
