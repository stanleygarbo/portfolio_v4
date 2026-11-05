import {
  expect,
  test,
  type Browser,
  type Locator,
  type Page,
} from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(
    /https:\/\/(www\.googletagmanager\.com|www\.google-analytics\.com|umami-phi-teal\.vercel\.app)\//,
    (route) => route.fulfill({ status: 200, body: "" }),
  );
});

async function readPalettes(page: Page, browser: Browser, baseURL: string) {
  const slugs = await page
    .locator("[data-project-slug]")
    .evaluateAll((cards) =>
      cards.map((card) => card.getAttribute("data-project-slug")!),
    );
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const reference = await context.newPage();
    const palettes = [];
    for (const slug of slugs) {
      await reference.goto(
        new URL(`/projects/${encodeURIComponent(slug)}`, baseURL).href,
      );
      palettes.push({
        background: await reference
          .locator("body")
          .evaluate((element) => getComputedStyle(element).backgroundColor),
        accent: await reference
          .getByRole("link", { name: "Stanley Garbo home" })
          .evaluate((element) => getComputedStyle(element).color),
        foreground: await reference
          .locator("main .inner p")
          .evaluate((element) => getComputedStyle(element).color),
      });
    }
    return palettes;
  } finally {
    await context.close();
  }
}

async function centerProject(card: Locator) {
  await card.evaluate((element) => {
    const { top, height } = element.getBoundingClientRect();
    window.scrollBy(0, top + height / 2 - window.innerHeight / 2);
  });
}

async function expectPalette(
  page: Page,
  card: Locator,
  palette: { background: string; accent: string; foreground: string },
) {
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    palette.background,
  );
  await expect(
    page.getByRole("link", { name: "Stanley Garbo home" }),
  ).toHaveCSS("color", palette.accent);
  await expect(card.locator("h3")).toHaveCSS("color", palette.foreground);
}

test("follows each project in both directions and restores the default palette outside projects", async ({
  page,
  browser,
  baseURL,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-content__cta")).toHaveCSS("opacity", "1");
  const defaultBackground = await page
    .locator("body")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  const defaultButtonColor = await page
    .locator("#contact .socials a")
    .first()
    .evaluate((element) => getComputedStyle(element).color);
  const palettes = await readPalettes(page, browser, baseURL!);
  const cards = page.locator("[data-project-slug]");

  for (let index = 0; index < palettes.length; index++) {
    await centerProject(cards.nth(index));
    await expectPalette(page, cards.nth(index), palettes[index]);
  }
  for (let index = palettes.length - 1; index >= 0; index--) {
    await centerProject(cards.nth(index));
    await expectPalette(page, cards.nth(index), palettes[index]);
  }

  // Both sides of the gap should retain their neighboring project's palette.
  for (let index = 0; index < palettes.length - 1; index++) {
    for (const fraction of [0.25, 0.75]) {
      await cards.nth(index).evaluate((element, fraction) => {
        const next = element.nextElementSibling!;
        const bottom = element.getBoundingClientRect().bottom;
        const gap = next.getBoundingClientRect().top - bottom;
        window.scrollBy(0, bottom + gap * fraction - window.innerHeight / 2);
      }, fraction);
      const activeIndex = fraction < 0.5 ? index : index + 1;
      await expectPalette(page, cards.nth(activeIndex), palettes[activeIndex]);
    }
  }

  await page.locator("#about").evaluate((element) => element.scrollIntoView());
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    defaultBackground,
  );
  await page
    .locator("#contact")
    .evaluate((element) => element.scrollIntoView());
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    defaultBackground,
  );
  await expect(page.locator("#contact .socials a").first()).toHaveCSS(
    "color",
    defaultButtonColor,
  );
  await page.locator("#hero").evaluate((element) => element.scrollIntoView());
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    defaultBackground,
  );
});

test("updates the palette after content changes size without scrolling", async ({
  page,
  browser,
  baseURL,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-content__cta")).toHaveCSS("opacity", "1");
  const palettes = await readPalettes(page, browser, baseURL!);
  const cards = page.locator("[data-project-slug]");
  expect(palettes.length).toBeGreaterThan(1);
  await page.evaluate(() => {
    document.documentElement.style.overflowAnchor = "none";
  });
  await centerProject(cards.nth(1));
  await expectPalette(page, cards.nth(1), palettes[1]);
  const scrollY = await page.evaluate(() => window.scrollY);

  await cards.first().evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const growth = window.innerHeight / 2 - bounds.bottom + 100;
    element.style.minHeight = `${bounds.height + growth}px`;
  });

  await expectPalette(page, cards.first(), palettes[0]);
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
});

test("handles fast jumps and a viewport resize without leaving a stale theme", async ({
  page,
  browser,
  baseURL,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-content__cta")).toHaveCSS("opacity", "1");
  const palettes = await readPalettes(page, browser, baseURL!);
  const cards = page.locator("[data-project-slug]");
  await centerProject(cards.first());
  await expectPalette(page, cards.first(), palettes[0]);

  await cards.last().evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    window.scrollBy(0, bounds.top + bounds.height / 2 - window.innerHeight / 2);
    window.scrollTo(0, 0);
    window.scrollBy(
      0,
      element.getBoundingClientRect().top +
        bounds.height / 2 -
        window.innerHeight / 2,
    );
  });
  await expectPalette(page, cards.last(), palettes[palettes.length - 1]);

  const size = page.viewportSize()!;
  await page.setViewportSize({ width: size.width, height: size.height + 200 });
  await centerProject(cards.first());
  await expectPalette(page, cards.first(), palettes[0]);
});
