import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Analytics are unrelated to site behavior and should not make tests depend on third parties.
  await page.route("https://www.googletagmanager.com/**", (route) =>
    route.abort(),
  );
  await page.route("https://www.google-analytics.com/**", (route) =>
    route.abort(),
  );
  await page.route("https://umami-phi-teal.vercel.app/**", (route) =>
    route.abort(),
  );
});

test("renders the homepage without a loading screen or horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "I Craft Beautiful and",
  );
  await expect(page.locator("#hero .cover")).toHaveCount(0);
  await expect(page.locator(".hero-content__cta")).toHaveCSS("opacity", "1");
  await expect(
    page.getByRole("link", { name: "hire me", exact: true }),
  ).toHaveAttribute("href", /^mailto:/);
  const cta = page.locator(".hero-content__cta");
  const ctaWidth = await cta.evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  expect(ctaWidth).toBeLessThan(180);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("opens the menu and navigates to the projects section", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("button", { name: "Close menu" }),
  ).toHaveAttribute("aria-expanded", "true");
  await page
    .locator("#navigation-menu")
    .getByRole("link", { name: "03 Projects" })
    .click();
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(
    page.getByRole("heading", { name: /Projects\.$/, level: 2 }),
  ).toBeInViewport();
});

test("opens a case study and returns home without hydration errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const project = page.locator("#projects a[href^='/projects/']").first();
  await project.scrollIntoViewIfNeeded();
  await project.click();
  await expect(page).toHaveURL(/\/projects\/[^/]+$/);
  await expect(page.locator("main h1")).not.toBeEmpty();
  await expect(page).not.toHaveTitle(/<!--/);
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute(
    "href",
    /^https:\/\/stanleygarbo.com\/projects\//,
  );
  for (const image of await page.locator("main img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    await expect(image).not.toHaveJSProperty("naturalWidth", 0);
  }
  await page.getByRole("link", { name: "Stanley Garbo home" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.locator(".hero-content__cta")).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
});

test("returns a real 404 for a missing project", async ({ page }) => {
  const response = await page.goto(
    "/projects/this-project-does-not-exist-upgrade-test",
  );
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("404");
  await expect(page.locator("meta[name='robots']")).toHaveAttribute(
    "content",
    "noindex",
  );
});

test("keeps the homepage usable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "hire me", exact: true }),
  ).toBeVisible();
  await context.close();
});

test("respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-content__cta")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero-content__name")).toHaveCSS(
    "transform",
    "none",
  );
});
