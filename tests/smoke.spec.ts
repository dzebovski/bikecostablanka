import {expect, test} from "@playwright/test";

const pages = [
  ["/", "A winter house"],
  ["/the-house", "A place to live"],
  ["/winter", "A season that feels"],
  ["/routes", "Three routes"],
  ["/routes/coll-de-rates", "Coll de Rates"],
  ["/routes/vall-debo", "Vall d’Ebo"],
  ["/routes/ondara-bernia", "Ondara–Bernia"],
  ["/explore", "There is more than one way"],
  ["/getting-here", "The last part of the journey"],
  ["/enquire", "Tell us what a good winter"],
] as const;

test("all MVP pages render and keep the prototype out of search", async ({page}) => {
  for (const [path, heading] of pages) {
    const response = await page.goto(path);
    expect(response?.ok(), `${path} should load`).toBeTruthy();
    await expect(page.getByRole("heading", {level: 1, name: new RegExp(heading, "i")})).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
});

test("an unknown route slug uses the branded 404", async ({page}) => {
  const response = await page.goto("/routes/not-a-real-route");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", {name: "This road is not in the route book."})).toBeVisible();
});

test("mobile navigation opens and reaches an internal page", async ({page}) => {
  await page.setViewportSize({width: 375, height: 812});
  await page.goto("/");
  await page.getByRole("button", {name: "Menu"}).click();
  const mobileNavigation = page.getByRole("navigation", {name: "Mobile navigation"});
  await expect(mobileNavigation).toBeVisible();
  await mobileNavigation.getByRole("link", {name: /Winter/}).click();
  await expect(page).toHaveURL(/\/winter$/);
});

test("the mock form validates dates and group numbers, then succeeds locally", async ({page}) => {
  await page.goto("/enquire?interest=cycling");
  await expect(page.locator('form[data-client-ready="true"]')).toBeVisible();
  const arrival = page.getByLabel("Arrival");
  const departure = page.getByLabel("Departure");
  await arrival.fill("2027-01-01");
  await departure.fill("2027-01-10");
  await expect(arrival).toHaveValue("2027-01-01");
  await expect(departure).toHaveValue("2027-01-10");
  await page.getByLabel("Guests").selectOption("2");
  await page.getByLabel("Cyclists").selectOption("3");
  await page.getByLabel("Name").fill("Test Rider");
  await page.getByLabel("Email").fill("rider@example.com");
  await page.getByRole("button", {name: "Send demo enquiry"}).click();

  await expect(page.getByText("Stays must be at least 15 nights.")).toBeVisible();
  await expect(page.getByText("Cyclists cannot exceed the number of guests.")).toBeVisible();

  await departure.fill("2027-01-20");
  await page.getByLabel("Cyclists").selectOption("2");
  await page.getByRole("button", {name: "Send demo enquiry"}).click();

  await expect(page.getByRole("heading", {name: "Thank you, Test Rider."})).toBeVisible();
  await expect(page.getByText(/not sent or saved anywhere/i)).toBeVisible();
});
