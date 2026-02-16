import { expect } from "@playwright/test";

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      /**
       * Asserts that the received value is a valid number (not NaN).
       */
      toBeANumber(): R;
    }
  }
}
