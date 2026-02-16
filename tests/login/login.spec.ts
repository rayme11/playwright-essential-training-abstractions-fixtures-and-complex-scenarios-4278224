import { test, expect } from "@playwright/test";
import { LoginPage } from "../../lib/pages/login.page";
import exp from "constants";
import {
  registerUser,
  generateRandomPassword,
} from "../../lib/pages/datafactory/register";

test("login without page object", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.locator('[data-test="nav-sign-in"]').click();
  await page
    .locator('[data-test="email"]')
    .fill("customer@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("welcome01");
  await page.locator('[data-test="login-submit"]').click();
  await expect(page.locator('[data-test="nav-menu"]')).toContainText(
    "Jane Doe"
  );
  await expect(page.locator('[data-test="page-title"]')).toContainText(
    "My account"
  );
});

test("Login with data factory object - user data", async ({ page }) => {
  const email = `test${Date.now()}@practicesoftwaretesting.com`;
  const password = generateRandomPassword();
  await registerUser(email, password);

  const loginPage = new LoginPage(page);
  await loginPage.goto();
});
