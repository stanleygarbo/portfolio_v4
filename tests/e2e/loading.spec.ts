import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(
    /https:\/\/(www\.(googletagmanager|google-analytics)\.com|umami-phi-teal\.vercel\.app)\//,
    (route) => route.fulfill({ status: 200, body: "" }),
  );
});

test("shows the original cover while fonts load, then reveals the homepage", async ({
  page,
}) => {
  let releaseFonts!: () => void;
  const fontsReady = new Promise<void>((resolve) => {
    releaseFonts = resolve;
  });
  await page.route(/\.woff2?(\?|$)/, async (route) => {
    await fontsReady;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const screen = page.locator("[data-loading-screen]");
  await expect(screen).toHaveAttribute("data-phase", "covered");
  await expect(screen).toHaveText("Loading the greatness...");
  await expect(screen).toHaveCSS("background-color", "rgb(20, 19, 19)");
  await expect(page.locator("#main")).toHaveJSProperty("inert", false);
  await expect(
    page.locator("#main").locator("xpath=ancestor::*[@inert]"),
  ).toHaveCount(1);
  releaseFonts();
  await expect(screen).toHaveAttribute("data-phase", "hidden");
  await expect(page.locator(".hero-content__cta")).toHaveCSS("opacity", "1");
  await expect(
    page.getByRole("link", { name: "hire me", exact: true }),
  ).toBeVisible();
});

test("covers pending App Router navigation and releases it after the destination loads", async ({
  page,
}) => {
  let releaseNavigation!: () => void;
  const navigationReady = new Promise<void>((resolve) => {
    releaseNavigation = resolve;
  });
  // Hold prefetch and click requests so this exercises a genuinely pending route.
  await page.route(/\/projects\/[^/?]+\?.*_rsc=/, async (route) => {
    await navigationReady;
    await route.continue();
  });
  await page.goto("/");
  const screen = page.locator("[data-loading-screen]");
  await expect(screen).toHaveAttribute("data-phase", "hidden");
  const project = page.locator("#projects a[href^='/projects/']").first();
  const path = await project.getAttribute("href");
  await project.scrollIntoViewIfNeeded();
  await project.click();
  await expect(screen).toHaveAttribute("data-phase", "covered");
  await expect(screen).toHaveText("Loading...");
  await expect(page).toHaveURL("/");
  await expect(page.locator("main h1")).toContainText("I Craft Beautiful and");
  releaseNavigation();
  await expect(page).toHaveURL(path!);
  await expect(screen).toHaveAttribute("data-phase", "hidden");
  await expect(page.locator("main h1")).toBeVisible();
  await page.getByRole("link", { name: "Stanley Garbo home" }).click();
  await expect(page).toHaveURL("/");
  await expect(screen).toHaveAttribute("data-phase", "hidden");
});

test("changes pages only while the loading screen fully covers the viewport", async ({
  page,
}) => {
  await page.goto("/");
  const screen = page.locator("[data-loading-screen]");
  await expect(screen).toHaveAttribute("data-phase", "hidden");

  const watchPageChange = async () => {
    await screen.evaluate((element) => {
      element.removeAttribute("data-swap-covered");
      const heading = document.querySelector("main h1");
      const observer = new MutationObserver(() => {
        if (document.querySelector("main h1") === heading) return;
        const bounds = element.getBoundingClientRect();
        element.setAttribute(
          "data-swap-covered",
          String(
            getComputedStyle(element).visibility === "visible" &&
              bounds.top <= 0 &&
              bounds.bottom >= window.innerHeight,
          ),
        );
        observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  };

  await watchPageChange();
  const project = page.locator("#projects a[href^='/projects/']").first();
  await project.scrollIntoViewIfNeeded();
  await project.click();
  await expect(page).toHaveURL(/\/projects\/[^/]+$/);
  await expect(screen).toHaveAttribute("data-swap-covered", "true");
  await expect(screen).toHaveAttribute("data-phase", "hidden");

  // The homepage is now cached, so this also checks an instant route render.
  await watchPageChange();
  await page.getByRole("link", { name: "Stanley Garbo home" }).click();
  await expect(page).toHaveURL("/");
  await expect(screen).toHaveAttribute("data-swap-covered", "true");
  await expect(screen).toHaveAttribute("data-phase", "hidden");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await watchPageChange();
  await project.scrollIntoViewIfNeeded();
  await project.click();
  await expect(page).toHaveURL(/\/projects\/[^/]+$/);
  await expect(screen).toHaveAttribute("data-swap-covered", "true");
  await expect(screen).toHaveAttribute("data-phase", "hidden");
});

test("cancels a queued page change when the user goes back during the cover animation", async ({
  page,
}) => {
  await page.goto("/");
  const screen = page.locator("[data-loading-screen]");
  await expect(screen).toHaveAttribute("data-phase", "hidden");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .locator("#navigation-menu")
    .getByRole("link", { name: "02 About" })
    .click();
  await expect(page).toHaveURL(/#about$/);

  const project = page.locator("#projects a[href^='/projects/']").first();
  await project.scrollIntoViewIfNeeded();
  await project.click();
  await expect(screen).toHaveAttribute("data-phase", "covering");
  await page.goBack();
  await expect(screen).toHaveAttribute("data-phase", "hidden");
  await expect(page).toHaveURL("/");
  await expect(page.locator("main h1")).toContainText("I Craft Beautiful and");
});

test("section indicators and menu anchors keep the page revealed", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const screen = page.locator("[data-loading-screen]");
  await expect(screen).toHaveAttribute("data-phase", "hidden");
  await screen.evaluate((element) => {
    element.setAttribute("data-unexpected-cover", "false");
    new MutationObserver(() => {
      if (element.getAttribute("data-phase") !== "hidden") {
        element.setAttribute("data-unexpected-cover", "true");
      }
    }).observe(element, { attributes: true, attributeFilter: ["data-phase"] });
  });
  // Section indicators are intentionally hidden at mobile widths.
  if (!isMobile) {
    await page.locator('a[href="#projects"]').click();
    await expect(page).toHaveURL(/#projects$/);
  }
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .locator("#navigation-menu")
    .getByRole("link", { name: "03 Projects" })
    .click();
  await expect(page).toHaveURL(/#projects$/);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .locator("#navigation-menu")
    .getByRole("link", { name: "01 Hero" })
    .click();
  await expect(page).toHaveURL(/#hero$/);
  await expect(screen).toHaveAttribute("data-unexpected-cover", "false");
});
