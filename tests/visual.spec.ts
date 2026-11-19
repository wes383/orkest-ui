import { expect, test, type Page } from '@playwright/test';

const pages = [
  { name: 'button', path: '/docs/components/button/' },
  { name: 'card', path: '/docs/components/card/' },
  { name: 'table', path: '/docs/components/table/' },
  { name: 'pagination', path: '/docs/components/pagination/' },
];

async function applyTheme(page: Page, theme: 'light' | 'dark') {
  await page.addInitScript((value) => {
    window.localStorage.setItem('orkest-theme', value);
  }, theme);
}

for (const item of pages) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${item.name} ${theme}`, async ({ page }) => {
      await applyTheme(page, theme);
      await page.goto(item.path);

      const preview = page.locator('.component-preview').first();
      await preview.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready.then(() => undefined));

      await expect(preview).toHaveScreenshot(`${item.name}-${theme}.png`);
    });
  }
}
