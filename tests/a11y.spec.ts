import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { componentPages } from './docs-pages';

for (const item of componentPages) {
  test(`${item.name} has no accessibility violations`, async ({ page }) => {
    await page.goto(item.path);

    // Client components hydrate after the document loads and briefly render their empty
    // state, so wait for the network to settle before scanning the enhanced markup.
    await page.waitForLoadState('networkidle');
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );

    // Scan the rendered examples rather than the whole article: the surrounding page,
    // including the syntax-highlighted samples, is owned by the docs site.
    const results = await new AxeBuilder({ page })
      .include('.preview-canvas')
      // Several examples of the same component share one page here, so their default
      // landmark labels repeat. Uniqueness is a page-authoring concern, not a component one.
      .disableRules(['landmark-unique'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
