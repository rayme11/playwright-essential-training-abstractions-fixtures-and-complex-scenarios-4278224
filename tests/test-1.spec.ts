import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/auth/register");
  await page.getByTestId('first-name').fill('TestF');
  await page.getByTestId('first-name').press('Tab');
  await page.getByTestId('last-name').fill('TestL');
  await page.getByTestId('dob').fill('2000-01-10');
  await page.getByTestId('street').fill('Tlamantes 6788');
  await page.getByTestId('postal_code').fill('78681');
  await page.getByTestId('city').fill('Round Rock');
  await page.getByTestId('state').fill('tx');
  await page.getByTestId('country').selectOption('US');
  await page.getByTestId('phone').fill('8135089922');
  await page.getByTestId('email').fill('testRayM2@gmail.com');
  await page.getByTestId('email').press('Tab');
  await page.getByTestId('password').fill('Abcd12345!Temp12345');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByTestId('register-submit').click();
  
});