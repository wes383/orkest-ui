import { expect, test, type Page } from '@playwright/test';

import { componentPages } from './docs-pages';

// Date and time examples render the current day, so the clock is pinned before the page
// boots; otherwise the baselines would expire at the next month boundary.
const frozenTime = new Date('2026-06-15T10:30:00');

async function applyTheme(page: Page, theme: 'light' | 'dark') {
  await page.addInitScript((value) => {
    window.localStorage.setItem('orkest-theme', value);
  }, theme);
}

async function waitForStableContent(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map((image) => image.decode().catch(() => undefined)),
    );
  });
}

for (const item of componentPages) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${item.name} ${theme}`, async ({ page }) => {
      await page.clock.setFixedTime(frozenTime);
      await applyTheme(page, theme);
      await page.goto(item.path);

      const preview = page.locator('.component-preview').first();
      await preview.scrollIntoViewIfNeeded();
      await waitForStableContent(page);

      await expect(preview).toHaveScreenshot(`${item.name}-${theme}.png`);
    });
  }
}
