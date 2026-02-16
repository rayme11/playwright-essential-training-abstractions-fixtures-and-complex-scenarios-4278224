import { expect } from "@playwright/test";

expect.extend({
  toBeANumber(received: any) {
    const pass = typeof received === "number" && !isNaN(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a number`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be a number, but got ${typeof received}`,
        pass: false,
      };
    }
  },
});
