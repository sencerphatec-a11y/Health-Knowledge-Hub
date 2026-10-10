import { test, expect, type Page } from '@playwright/test';

const idFor = (type: number, index: number) =>
  `${String(type).padStart(8, '0')}-1111-4111-8111-${String(index).padStart(12, '0')}`;
const row = (page: Page, type: number, index: number) =>
  page.getByTestId(`link-medication-label-${idFor(type, index)}`);
const sourceUrl = (id: string) =>
  `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${id}`;

test.beforeEach(async ({ request }) => {
  expect((await request.post('/__fixtures', { data: { unavailable: false, hold: false } })).ok()).toBeTruthy();
});
test.afterEach(async ({ request }) => {
  await request.post('/__fixtures', { data: { unavailable: false, hold: false } });
});

test('search submission resets paging; next, previous, reload and browser back preserve results', async ({ page }) => {
  await page.goto('/medications?q=before&page=2');
  await expect(row(page, 0, 20)).toBeVisible();
  const input = page.getByRole('textbox', { name: 'Search medication labels' });
  await input.fill('  pain & fever  ');
  await page.getByTestId('button-search-medication-labels').click();
  await expect(page).toHaveURL(/\/medications\?q=pain\+%26\+fever$/);
  await expect(page.getByTestId('text-medication-catalog-summary')).toContainText('48 label records');
  await expect(row(page, 0, 0)).toBeVisible();
  await expect(page.getByTestId('button-medications-previous')).toBeDisabled();
  await page.getByTestId('button-medications-next').click();
  await expect(page).toHaveURL(/q=pain\+%26\+fever&page=2$/);
  await expect(row(page, 0, 20)).toBeVisible();
  await expect(row(page, 0, 0)).toHaveCount(0);
  await page.reload();
  await expect(input).toHaveValue('pain & fever');
  await expect(row(page, 0, 20)).toBeVisible();
  await page.getByTestId('button-medications-next').click();
  await expect(page.getByRole('navigation', { name: 'Medication label pages' })).toContainText('Page 3 of 3');
  await expect(row(page, 1, 17)).toBeVisible();
  await expect(page.getByTestId('button-medications-next')).toBeDisabled();
  await page.getByTestId('button-medications-previous').click();
  await expect(page).toHaveURL(/page=2$/);
  await expect(row(page, 0, 20)).toBeVisible();
  await row(page, 0, 20).click();
  await expect(page.getByRole('heading', { name: 'Labeled uses', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/q=pain\+%26\+fever&page=2$/);
  await expect(input).toHaveValue('pain & fever');
  await expect(row(page, 0, 20)).toBeVisible();
  await page.getByTestId('button-clear-medication-search').click();
  await expect(page).toHaveURL(/\/medications$/);
  await expect(input).toHaveValue('');
  await expect(row(page, 0, 0)).toBeVisible();
  await input.fill('metformin');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/medications\?q=metformin$/);
  await page.goBack();
  await expect(input).toHaveValue('');
  await expect(row(page, 0, 0)).toBeVisible();
});

test('out-of-range pages are clamped with replacement, not another history entry', async ({ page }) => {
  await page.goto('/medications?q=clamp-origin');
  await expect(row(page, 0, 0)).toBeVisible();
  await page.evaluate(() => {
    history.pushState(null, '', '/medications?q=clamp&page=999');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page).toHaveURL(/\/medications\?q=clamp&page=3$/);
  await expect(page.getByTestId('list-medication-labels').locator('a')).toHaveCount(8);
  await expect(row(page, 1, 17)).toBeVisible();
  await page.reload();
  await expect(row(page, 1, 17)).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/q=clamp-origin$/);
  await expect(row(page, 0, 0)).toBeVisible();
});

for (const invalidPage of ['0', '-2', '1.5', 'not-a-number']) {
  test(`invalid page ${invalidPage} safely displays the first page`, async ({ page }) => {
    await page.goto(`/medications?q=invalid-page-${invalidPage}&page=${invalidPage}`);
    await expect(row(page, 0, 0)).toBeVisible();
    await expect(page.getByTestId('button-medications-previous')).toBeDisabled();
    await expect(page.getByRole('navigation', { name: 'Medication label pages' })).toContainText('Page 1 of 3');
  });
}

test('loading appears until the upstream responds, then results replace it', async ({ page, request }) => {
  await request.post('/__fixtures', { data: { hold: true } });
  await page.goto('/medications?q=loading');
  const loading = page.getByRole('region', { name: 'Loading medication labels' });
  await expect(loading).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByTestId('list-medication-labels')).toHaveCount(0);
  await expect(page.getByTestId('empty-medication-catalog')).toHaveCount(0);
  await request.post('/__fixtures', { data: { hold: false } });
  await expect(row(page, 0, 0)).toBeVisible();
  await expect(loading).toHaveCount(0);
});

test('empty search is distinct from service failure and can be cleared', async ({ page }) => {
  await page.goto('/medications?q=empty&page=999');
  await expect(page.getByTestId('empty-medication-catalog')).toBeVisible();
  await expect(page).toHaveURL(/\/medications\?q=empty$/);
  await expect(page.getByTestId('text-medication-catalog-summary')).toContainText('0 label records');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Medication label pages' })).toHaveCount(0);
  await page.getByTestId('empty-medication-catalog').getByRole('button', { name: 'Clear search' }).click();
  await expect(page).toHaveURL(/\/medications$/);
  await expect(row(page, 0, 0)).toBeVisible();
});

test('unavailable catalog shows an error and explicit retry recovers', async ({ page, request }) => {
  await request.post('/__fixtures', { data: { unavailable: true } });
  await page.goto('/medications?q=retry-catalog');
  await expect(page.getByRole('alert')).toContainText('Labels could not be loaded.');
  await expect(page.getByTestId('empty-medication-catalog')).toHaveCount(0);
  await expect(page.getByTestId('list-medication-labels')).toHaveCount(0);
  await request.post('/__fixtures', { data: { unavailable: false } });
  await page.getByTestId('button-retry-medication-catalog').click();
  await expect(row(page, 0, 0)).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page).toHaveURL(/q=retry-catalog$/);
});

test('detail service failure recovers through its retry button', async ({ page, request }) => {
  await request.post('/__fixtures', { data: { unavailable: true } });
  await page.goto(`/medications/${idFor(0, 2)}`);
  await expect(page.getByRole('alert')).toContainText('This label could not be opened.');
  await request.post('/__fixtures', { data: { unavailable: false } });
  await page.getByTestId('button-retry-medication-label').click();
  await expect(page.locator('.uses-copy')).toContainText('Fixture labeled use for temporary pain relief.');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

for (const id of ['not-a-label', idFor(0, 999)]) {
  test(`invalid or removed label ${id} offers a way back`, async ({ page }) => {
    await page.goto(`/medications/${id}`);
    await expect(page.getByRole('alert')).toContainText('This label could not be opened.');
    await expect(page.getByTestId('link-original-dailymed-label')).toHaveCount(0);
    await page.getByRole('link', { name: 'Back to medication labels' }).click();
    await expect(page).toHaveURL(/\/medications$/);
    await expect(row(page, 0, 0)).toBeVisible();
  });
}

test('missing uses explains the limitation and retains the original-source citation', async ({ page }) => {
  const id = idFor(0, 1);
  await page.goto(`/medications/${id}`);
  await expect(page.locator('.uses-unavailable')).toContainText('The current label did not expose a separate uses section');
  await expect(page.locator('.uses-unavailable')).toContainText('Open the original DailyMed label');
  await expect(page.locator('.uses-copy')).toHaveCount(0);
  await expect(page.getByTestId('link-original-dailymed-label')).toHaveAttribute('href', sourceUrl(id));
  await expect(page.getByTestId('link-original-dailymed-label')).toHaveAttribute('target', '_blank');
  await expect(page.getByRole('complementary', { name: 'Original medication label' })).toContainText('DailyMed inclusion is not proof of FDA approval or effectiveness.');
});

test('extracted uses include nested indications and link to the exact product source', async ({ page }) => {
  await page.goto('/medications?q=citations');
  await row(page, 0, 0).click();
  await expect(page.locator('.uses-copy')).toContainText('Fixture labeled use for temporary pain relief.');
  await expect(page.locator('.uses-copy')).toContainText('Fixture nested indication.');
  await expect(page.getByTestId('link-original-dailymed-label')).toHaveAttribute('href', sourceUrl(idFor(0, 0)));
  await expect(page.getByTestId('link-original-dailymed-label')).toHaveAttribute('rel', 'noreferrer');
});

for (const [slug, title] of [['ibuprofen', 'Ibuprofen'], ['acetaminophen', 'Acetaminophen'], ['metformin', 'Metformin']]) {
  test(`authored ${title} guide remains reachable from the catalog and directly`, async ({ page }) => {
    await page.goto('/medications');
    const guides = page.getByRole('region', { name: 'Authored medication guides' });
    await guides.locator(`a[href="/medications/${slug}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`/medications/${slug}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.getByRole('complementary', { name: 'Primary sources' })).toContainText('MedlinePlus');
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.getByTestId('button-retry-medication-label')).toHaveCount(0);
  });
}

for (const width of [320, 390]) {
  test(`long product titles fit catalog and detail at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`/medications?q=mobile-${width}`);
    await expect(row(page, 0, 0)).toBeVisible();
    async function assertFits(selector: string) {
      const bounds = await page.locator(selector).evaluate(element => {
        const rect = element.getBoundingClientRect();
        return {
          left: rect.left, right: rect.right,
          client: element.clientWidth, scroll: element.scrollWidth,
          document: document.documentElement.scrollWidth,
          viewport: window.innerWidth,
        };
      });
      // Check text itself too: hiding body overflow must not make this pass.
      expect(bounds.scroll).toBeLessThanOrEqual(bounds.client + 1);
      expect(bounds.left).toBeGreaterThanOrEqual(0);
      expect(bounds.right).toBeLessThanOrEqual(bounds.viewport + 1);
      expect(bounds.document).toBeLessThanOrEqual(bounds.viewport + 1);
    }
    await assertFits(`[data-testid="link-medication-label-${idFor(0, 0)}"] .label-title`);
    await row(page, 0, 0).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('SuperLongUnbrokenProductName');
    await assertFits('.detail-hero h1');
    await expect(page.getByTestId('link-original-dailymed-label')).toBeVisible();
  });
}
