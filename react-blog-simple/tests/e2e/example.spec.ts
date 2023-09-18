import { test, expect } from '@playwright/test';

test('Visit page', async ({ page }) => {
	await page.goto('http://localhost:3000/');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle('Vite + React + TS');
});

test('Check btn click', async ({ page }) => {
	await page.goto('http://localhost:3000/');

	// Click the get started link.
	const countBtn = page.locator('data-testid=test-countbtn');

	countBtn.click();

	// Expects page to have a heading with the name of Installation.
	await expect(countBtn.first().innerHTML({timeout: 1000})).toBe('count is 1');
});
