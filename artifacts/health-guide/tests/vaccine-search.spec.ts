import { test, expect } from '@playwright/test';

for (const query of ['vaccines', 'immunization']) {
  test(`global search for "${query}" opens the vaccine schedules and fact sheets`, async ({ page }) => {
    await page.goto('/');
    const origin = new URL(page.url()).origin;
    await page.getByTestId('input-home-search').fill(query);
    await page.getByTestId('button-home-search').click();
    await expect(page).toHaveURL(url =>
      url.origin === origin && url.pathname === '/search' && url.searchParams.get('q') === query);

    const card = page.getByTestId('card-guide-vaccines');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('href', '/vaccines');
    await card.click();

    await expect(page).toHaveURL(`${origin}/vaccines`);
    await expect(page.getByRole('heading', { level: 1, name: 'Vaccines, with sources.' })).toBeVisible();

    // Check actual section content, not just a matching URL or page title.
    const schedules = page.getByRole('region', { name: 'Timing by life stage.', exact: true });
    await expect(schedules).toBeVisible();
    await expect(schedules.getByRole('tablist', { name: 'Schedule groups' })).toBeVisible();
    const panel = schedules.getByRole('tabpanel');
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('table')).toBeVisible();
    await expect(panel.locator('tbody tr').first()).toBeVisible();

    const facts = page.getByRole('region', { name: /^\d+ vaccine references\.$/ });
    await expect(facts).toBeVisible();
    await expect(facts.getByRole('textbox', { name: 'Search vaccines', exact: true })).toBeVisible();
    await expect(facts.getByTestId('text-vaccine-count')).toHaveText(/^[1-9]\d* of [1-9]\d* records$/);
    await expect(facts.locator('[data-testid^="card-vaccine-"]').first()).toBeVisible();
  });
}
