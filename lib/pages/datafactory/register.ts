import { request, expect } from "@playwright/test";

export function generateRandomPassword(length: number = 12): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "@#$%&*!?";

  // Ensure we have at least one of each required type
  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest with random characters from all sets
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to randomize position of required characters
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

export async function registerUser(email: string, password: string) {
  const createRequestContext = await request.newContext();
  const apiURL = process.env.API_URL;
  const response = await createRequestContext.post(`${apiURL}/users/register`, {
    data: {
      first_name: "TestF",
      last_name: "TestL",
      dob: "2000-01-10",
      phone: "8135089922",
      email: email,
      password: password,
      address: {
        street: "Talamantes 6788",
        city: "Round Rock",
        state: "Tx",
        country: "US",
        postal_code: "78681",
      },
    },
  });

  if (response.status() !== 201) {
    const errorBody = await response.json();
    console.log("\n=== API Registration Failed ===");
    console.log("Endpoint:", `${apiURL}/users/register`);
    console.log("Status Code:", response.status());
    console.log("Status Text:", response.statusText());
    console.log("\nError Response Body:");
    console.log(JSON.stringify(errorBody, null, 2));
    console.log("===============================\n");
  } else {
    const responseBody = await response.json();
    // Remove password from the response before logging
    const { password: _, ...userWithoutPassword } = responseBody;
    console.log("\n=== User Created Successfully ===");
    console.log("Endpoint:", `${apiURL}/users/register`);
    console.log("Status Code:", response.status());
    console.log("\nUser Details:");
    console.log(JSON.stringify(userWithoutPassword, null, 2));
    console.log("=================================\n");
  }

  expect(response.status()).toBe(201);
  return response.status();
}
