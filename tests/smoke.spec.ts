import { expect, test } from '@playwright/test';

test.describe('documentation smoke', () => {
  test('core pages load without console errors', async ({ page }) => {
    const errors: string[] = [];
    const failedResponses: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    page.on('response', (response) => {
      if (response.status() >= 400) {
        failedResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    for (const path of [
      '/docs/components/button/',
      '/docs/components/card/',
      '/docs/components/table/',
      '/docs/components/select/',
    ]) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }

    expect(failedResponses).toEqual([]);
    expect(errors).toEqual([]);
  });

  test('dialog opens and closes with Escape', async ({ page }) => {
    await page.goto('/docs/components/dialog/');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Edit profile' }).first().click();

    const dialog = page.getByRole('dialog', { name: 'Edit profile' });
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('select opens and commits an option', async ({ page }) => {
    await page.goto('/docs/components/select/');
    await page.waitForLoadState('networkidle');

    const trigger = page.getByRole('combobox', { name: 'Fruit' });
    await trigger.click();
    await expect(page.getByRole('listbox')).toBeVisible();

    await page.getByRole('option', { name: 'Banana' }).click();
    await expect(trigger).toContainText('Banana');
  });

  test('table caption stays available without being visible', async ({ page }) => {
    await page.goto('/docs/components/table/');

    const table = page.getByRole('table', { name: 'Invoices issued this quarter.' });
    await expect(table).toBeVisible();

    const caption = table.locator('caption');
    await expect(caption).toHaveText('Invoices issued this quarter.');

    const box = await caption.boundingBox();
    expect(box?.width ?? 0).toBeLessThanOrEqual(1);
    expect(box?.height ?? 0).toBeLessThanOrEqual(1);
  });
});
