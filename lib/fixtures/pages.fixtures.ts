import { LoginPage } from "@lib/pages/login.page";
import { test as baseTest } from "@playwright/test";

type MyPages = {
  LoginPage: LoginPage;
};



export const test = baseTest.extend<MyPages>({
  LoginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});