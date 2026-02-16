import { test, expect } from "@playwright/test";

test.describe("Home page with no auth", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("visual test", async ({ page, headless }) => {
    await page.waitForLoadState("networkidle");
    headless
      ? await test.step("visual test", async () => {
          await expect(page).toHaveScreenshot("home-page-no-auth.png", {
            mask: [page.getByTitle("Practice Software Testing - Toolshop")],
          });
        })
      : console.log("Running in Headed mode, no screenshot comparison");
  });

  test("check sign in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");
  });

  test("validate page title", async ({ page }) => {
    await expect(page).toHaveTitle(
      "Practice Software Testing - Toolshop - v5.0",
    );
  });

  test("grid loads with 9 items", async ({ page }) => {
    const productGrid = page.locator(".col-md-9");
    await expect(productGrid.getByRole("link")).toHaveCount(9);
    expect(await productGrid.getByRole("link").count()).toBe(9);
  });

  test("search for Thor Hammer", async ({ page }) => {
    const productGrid = page.locator(".col-md-9");
    await page.getByTestId("search-query").fill("Thor Hammer");
    await page.getByTestId("search-submit").click();
    await expect(productGrid.getByRole("link")).toHaveCount(1);
    await expect(page.getByAltText("Thor Hammer")).toBeVisible();
  });
});

test.describe("Home page customer 01 auth", () => {
  test.use({ storageState: ".auth/customer01.json" });
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("visual test authorized", async ({ page, headless }) => {
    await page.waitForLoadState("networkidle");
    headless
      ? await test.step("visual test", async () => {
          await expect(page).toHaveScreenshot("home-page-customer01.png", {
            mask: [page.getByTitle("Practice Software Testing - Toolshop")],
          });
        })
      : console.log("Running in Headed mode, no screenshot comparison");
  });
  test("check customer 01 is signed in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).not.toBeVisible();
    await expect(page.getByTestId("nav-menu")).toContainText("Jane Doe");
  });

  test("validate product data is visible in UI from API response", async ({
    page,
  }) => {
    const mockedProductsResponse = {
      current_page: 1,
      data: [
        {
          id: "mock-001",
          name: "Mocked Hammer",
          description: "Intercepted API response",
          price: 9.99,
          is_location_offer: false,
          is_rental: false,
          co2_rating: "A",
          in_stock: true,
          is_eco_friendly: true,
          product_image: {
            file_name: "pliers01.avif",
            title: "Mocked Hammer",
          },
          category: { id: "mock-cat", name: "Mock Category" },
          brand: { id: "mock-brand", name: "Mock Brand" },
          image: "https://via.placeholder.com/300x200.png?text=Mocked+Hammer",
        },
      ],
      from: 1,
      last_page: 1,
      per_page: 9,
      to: 1,
      total: 1,
    };

    await page.route(
      "https://api.practicesoftwaretesting.com/products**",
      async (route) => {
        const req = route.request();
        console.log("\n--- INTERCEPTED REQUEST ---");
        console.log("URL:", req.url());
        console.log("METHOD:", req.method());

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockedProductsResponse),
        });
      },
    );

    await page.route("**/images/products/**", async (route) => {
      const pngBase64 =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAGgwJ/l3k5uQAAAABJRU5ErkJggg==";
      await route.fulfill({
        status: 200,
        contentType: "image/png",
        body: Buffer.from(pngBase64, "base64"),
      });
    });

    await Promise.all([
      page.waitForResponse((response) =>
        response
          .url()
          .startsWith("https://api.practicesoftwaretesting.com/products"),
      ),
      page.reload({ waitUntil: "domcontentloaded" }),
    ]);
    await expect(page.locator(".skeleton").first()).not.toBeVisible();

    const productGrid = page.locator(".col-md-9");
    await expect(productGrid.getByRole("link")).toHaveCount(1);
    await expect(
      productGrid.locator("[data-test='product-name']", {
        hasText: "Mocked Hammer",
      }),
    ).toHaveCount(1);

    const productImage = productGrid.getByAltText("Mocked Hammer");
    await expect(productImage).toBeVisible();
    await expect
      .poll(async () => {
        return productImage.evaluate(
          (img) => img.complete && img.naturalWidth > 0,
        );
      })
      .toBe(true);
  });
});
