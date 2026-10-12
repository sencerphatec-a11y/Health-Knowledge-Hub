import { test, expect } from '@playwright/test';

const externalLinks = [
  { label: 'Visit GoodRx', url: 'https://www.goodrx.com/' },
  { label: 'Search prescriptions on GoodRx', url: 'https://www.goodrx.com/search' },
  { label: 'How GoodRx works', url: 'https://www.goodrx.com/how-goodrx-works' },
];
const externalNotice = ' (opens external site in a new tab, leaves Health Guide)';

for (const query of ['GoodRx', 'prescription savings']) {
  test(`search for "${query}" stays in Health Guide until an explicit GoodRx link is chosen`, async ({ page, context }) => {
    // Intercept at context level so new tabs are covered too. Never depend on
    // the commercial site's network availability or load its real content.
    const goodRxRequests: string[] = [];
    await context.route(/^https?:\/\/(?:[^/]+\.)?goodrx\.com(?:\/|$)/i, async route => {
      goodRxRequests.push(route.request().url());
      await route.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><title>External destination fixture</title>',
      });
    });

    await page.goto('/');
    const origin = new URL(page.url()).origin;
    await page.getByTestId('input-home-search').fill(query);
    await page.getByTestId('button-home-search').click();
    await expect(page).toHaveURL(url =>
      url.origin === origin && url.pathname === '/search' && url.searchParams.get('q') === query);

    const card = page.getByTestId('card-guide-goodrx');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('href', '/goodrx');
    await expect(card).not.toHaveAttribute('target', '_blank');
    await expect(card).toContainText('Read the educational guide');
    await card.click();

    await expect(page).toHaveURL(`${origin}/goodrx`);
    await expect(page.getByRole('heading', { level: 1, name: 'Prescription coupons, explained.' })).toBeVisible();
    const notice = page.getByRole('note');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('GoodRx is not insurance.');
    await expect(notice).toContainText('Health Guide shows no live prices or coupons and cannot promise savings.');
    await expect(page.getByText('These open GoodRx, an external commercial site, in a new tab and leave Health Guide.', { exact: true })).toBeVisible();

    expect(context.pages()).toEqual([page]);
    expect(goodRxRequests).toEqual([]);
    const outbound = page.locator('main a[href^="https://www.goodrx.com/"]');
    await expect(outbound).toHaveCount(externalLinks.length);

    for (const { label, url } of externalLinks) {
      const link = page.getByRole('link', { name: label + externalNotice, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', url);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /(?:^|\s)noopener(?:\s|$)/);
      await expect(link).toHaveAttribute('rel', /(?:^|\s)noreferrer(?:\s|$)/);

      const popupPromise = page.waitForEvent('popup');
      await link.click();
      const popup = await popupPromise;
      await popup.waitForLoadState('domcontentloaded');
      await expect(popup).toHaveURL(url);
      expect(goodRxRequests).toEqual([url]);
      await expect(page).toHaveURL(`${origin}/goodrx`);
      await expect(notice).toBeVisible();
      await popup.close();
      goodRxRequests.length = 0;
    }
    expect(context.pages()).toEqual([page]);
  });
}
