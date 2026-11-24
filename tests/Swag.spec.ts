import { test, expect } from '@playwright/test';

const URL = 'https://www.saucedemo.com/';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

// Reusable login function
async function login(page: any) {
    await page.goto(URL);
    await page.locator('#user-name').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('#login-button').click();
}

test('TC01 - Login with valid credentials', async ({ page }) => {
    await login(page);

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
});

test('TC02 - Login with invalid credentials', async ({ page }) => {
    await page.goto(URL);

    await page.locator('#user-name').fill('invalid_user');
    await page.locator('#password').fill('invalid_password');
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]'))
        .toBeVisible();

    await expect(page.locator('[data-test="error"]'))
        .toContainText('Username and password do not match');
});

test('TC03 - Verify products are displayed', async ({ page }) => {
    await login(page);

    await expect(page.locator('.inventory_item'))
        .toHaveCount(6);

    await expect(page.locator('.inventory_item_name').first())
        .toBeVisible();
});