import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("renders hero, thesis, commitments, and CTA links", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/GJH Inc\./);

    // Hero title and trace
    const h1 = page.locator("h1");
    await expect(h1).toContainText("Most AI projects are data projects in a better suit");

    // Call to actions in hero
    const startConvo = page.locator('section a[href="/contact"]').first();
    await expect(startConvo).toBeVisible();
    await expect(startConvo).toHaveText("Start a conversation");

    const howWeWork = page.locator('section a[href="/work"]').first();
    await expect(howWeWork).toBeVisible();
    await expect(howWeWork).toHaveText("How we work");

    // Practices section
    await expect(page.getByRole("heading", { name: "Full AI services" })).toBeVisible();
    await expect(page.locator('a[href="/work/advisory"]').first()).toBeVisible();
    await expect(page.locator('a[href="/work/building"]').first()).toBeVisible();
    await expect(page.locator('a[href="/work/data-foundations"]').first()).toBeVisible();
    await expect(page.locator('a[href="/work/staying-with-it"]').first()).toBeVisible();

    // Three commitments
    await expect(page.getByText("Three commitments we put in writing")).toBeVisible();
    await expect(page.getByText("Start small and paid")).toBeVisible();
    await expect(page.getByText("You own everything")).toBeVisible();

    // Partners section
    await expect(page.getByText("Platforms we build on")).toBeVisible();
    await expect(page.getByText("Anthropic")).toBeVisible();
    await expect(page.getByText("Databricks")).toBeVisible();

    // Insights section
    await expect(page.getByText("Notes from the work")).toBeVisible();

    // Bottom CalloutCTA
    await expect(page.getByText("Tell us what you're trying to do.")).toBeVisible();
  });

  test("can navigate from hero CTA to contact page", async ({ page }) => {
    await page.goto("/");
    await page.locator('section a[href="/contact"]').first().click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.locator("h1")).toContainText("Tell us what you're trying to do.");
  });

  test("can navigate from hero CTA to work page", async ({ page }) => {
    await page.goto("/");
    await page.locator('section a[href="/work"]').first().click();
    await expect(page).toHaveURL(/\/work/);
    await expect(page.locator("h1")).toContainText("We would rather rule things out than sell you all of them.");
  });
});

test.describe("Site Navigation and Header", () => {
  test("header nav links work on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop test only");
    await page.goto("/");

    // Check each desktop nav link
    const navLinks = [
      { text: "Work", path: "/work" },
      { text: "Industries", path: "/sectors" },
      { text: "Partners", path: "/partners" },
      { text: "Insights", path: "/insights" },
      { text: "About", path: "/about" },
    ];

    for (const link of navLinks) {
      await page.goto("/");
      const navItem = page.locator(`header nav a[href="${link.path}"]`);
      await expect(navItem).toBeVisible();
      await navItem.click();
      await expect(page).toHaveURL(new RegExp(link.path));
    }

    // Contact button in header
    await page.goto("/");
    const contactBtn = page.locator('header a[href="/contact"]');
    await expect(contactBtn).toBeVisible();
    await contactBtn.click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test("mobile hamburger menu opens and navigates", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile test only");
    await page.goto("/");

    const menuButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    // Nav links should now be visible in mobile overlay
    const workLink = page.locator('#mobile-menu a[href="/work"]');
    await expect(workLink).toBeVisible();
    await workLink.click();
    await expect(page).toHaveURL(/\/work/);
  });

  test("footer links are valid and navigable", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const footerLinks = [
      { href: "/work", text: "Work" },
      { href: "/sectors", text: "Industries" },
      { href: "/partners", text: "Partners" },
      { href: "/insights", text: "Insights" },
      { href: "/about", text: "About" },
      { href: "/capability", text: "Capability statement" },
      { href: "/contact", text: "Contact" },
      { href: "/terms", text: "Terms" },
      { href: "/privacy", text: "Privacy" },
    ];

    for (const link of footerLinks) {
      const el = footer.locator(`a[href="${link.href}"]`).first();
      await expect(el).toBeVisible();
      await expect(el).toHaveText(link.text);
    }

    // Mailto link check
    const emailLink = footer.locator('a[href^="mailto:"]');
    await expect(emailLink).toHaveAttribute("href", "mailto:consult@gjh-inc.com");
  });
});

test.describe("Services & Work Journeys", () => {
  test("/work lists all 4 practices with details and links", async ({ page }) => {
    await page.goto("/work");
    await expect(page.locator("h1")).toContainText("How we work");

    const practices = [
      { slug: "advisory", name: "Advisory and readiness" },
      { slug: "building", name: "System delivery" },
      { slug: "foundations", name: "Data foundations" },
      { slug: "staying-with-it", name: "Evaluation and support" },
    ];

    for (const p of practices) {
      const practiceHeading = page.getByRole("heading", { name: p.name });
      await expect(practiceHeading).toBeVisible();

      const detailLink = page.locator(`a[href="/work/${p.slug}"]`).first();
      await expect(detailLink).toBeVisible();
    }
  });

  test("each practice detail page renders trace, deliverables, and navigation", async ({ page }) => {
    const slugs = ["advisory", "building", "foundations", "staying-with-it"];

    for (const slug of slugs) {
      await page.goto(`/work/${slug}`);
      await expect(page.locator("header a[href='/work']")).toBeVisible();
      await expect(page.locator("h1")).toBeVisible();

      // Check deliverables section
      await expect(page.getByText("What you walk away with")).toBeVisible();

      // Check trace section
      await expect(page.getByText("Representative sequence")).toBeVisible();

      // Check other practices nav
      await expect(page.getByText("Other practices")).toBeVisible();

      // Check CTA
      await expect(page.getByRole("link", { name: /Start an assessment|Start a conversation/ })).toBeVisible();
    }
  });

  test("/capability page renders correctly with all key sections", async ({ page }) => {
    await page.goto("/capability");
    await expect(page.locator("h1")).toContainText("GJH Inc.");
    await expect(page.getByText("Core competencies")).toBeVisible();
    await expect(page.getByText("Differentiators")).toBeVisible();
    await expect(page.getByText("Platforms")).toBeVisible();
    await expect(page.getByText("Contact")).toBeVisible();
    await expect(page.getByText("consult@gjh-inc.com")).toBeVisible();
  });
});

test.describe("Sectors / Industries Journeys", () => {
  test("/sectors overview page renders correctly", async ({ page }) => {
    await page.goto("/sectors");
    await expect(page.locator("h1")).toContainText("Industries");
    await expect(page.getByText("Waiting on approval")).toBeVisible();

    // Check industry names listed
    await expect(page.getByText("Financial services")).toBeVisible();
    await expect(page.getByText("Healthcare and life sciences")).toBeVisible();
    await expect(page.getByText("Manufacturing")).toBeVisible();
  });

  test("individual sector pages render problems and questions to ask", async ({ page }) => {
    const sectors = [
      "financial-services",
      "healthcare",
      "manufacturing",
      "defense-and-public",
      "energy",
      "retail",
    ];

    for (const slug of sectors) {
      await page.goto(`/sectors/${slug}`);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("header a[href='/sectors']")).toBeVisible();

      // Check Problems we see
      await expect(page.getByText("Problems we see")).toBeVisible();

      // Check Questions to ask
      await expect(page.getByText(/Questions to ask before you buy/)).toBeVisible();

      // Check other industries navigation
      await expect(page.getByText("Other industries")).toBeVisible();
    }
  });
});

test.describe("Partners Journey", () => {
  test("/partners renders partner wall and neutrality note", async ({ page }) => {
    await page.goto("/partners");
    await expect(page.locator("h1")).toContainText("Six partnerships");
    await expect(page.getByText("Anthropic")).toBeVisible();
    await expect(page.getByText("Databricks")).toBeVisible();
    await expect(page.getByText("On vendor neutrality")).toBeVisible();
    await expect(page.locator('a[href="/contact"]')).toBeVisible();
  });
});

test.describe("About Journey", () => {
  test("/about renders background, facts sidebar, and contact CTA", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("What we are not")).toBeVisible();
    await expect(page.getByText("Why we ask before we build")).toBeVisible();
    await expect(page.getByText("consult@gjh-inc.com")).toBeVisible();
    await expect(page.getByText("San Francisco, CA")).toBeVisible();
  });
});

test.describe("Insights / Blog Journey", () => {
  test("/insights lists articles with read time and topic", async ({ page }) => {
    await page.goto("/insights");
    await expect(page.locator("h1")).toContainText("Notes from the work");

    // Check that at least one insight article is listed
    const articles = page.locator("ul.divide-y li a");
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);

    const firstArticle = articles.first();
    await expect(firstArticle).toBeVisible();
    await expect(firstArticle.locator("h2")).toBeVisible();
  });

  test("insight article page renders full content, author, date, and related links", async ({ page }) => {
    await page.goto("/insights");
    const firstArticleLink = page.locator("ul.divide-y li a").first();
    const articleTitle = await firstArticleLink.locator("h2").innerText();

    await firstArticleLink.click();
    await expect(page).toHaveURL(/\/insights\/.+/);

    // Article heading
    await expect(page.locator("h1")).toHaveText(articleTitle);

    // Back link to insights
    const backLink = page.locator("header a[href='/insights']");
    await expect(backLink).toBeVisible();

    // Prose body content
    await expect(page.locator(".prose-gjh")).toBeVisible();

    // JSON-LD structured data
    const jsonLdScript = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScript).toBeAttached();
    const jsonLdContent = await jsonLdScript.textContent();
    expect(jsonLdContent).toContain('"@type":"Article"');
    expect(jsonLdContent).toContain(articleTitle);

    // Callout CTA
    await expect(page.getByText("Working on something like this?")).toBeVisible();
  });
});

test.describe("Contact Journey & Form Verification", () => {
  test("/contact renders form and direct mail options", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("h1")).toContainText("Start a conversation");

    // Form inputs
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="organization"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Direct email fallback
    const mailto = page.locator('aside a[href^="mailto:"]');
    await expect(mailto).toBeVisible();
    await expect(mailto).toHaveText("consult@gjh-inc.com");
  });

  test("contact form client validation prevents empty submission", async ({ page }) => {
    await page.goto("/contact");

    const emailInput = page.locator('input[name="email"]');
    const messageInput = page.locator('textarea[name="message"]');
    const submitBtn = page.locator('button[type="submit"]');

    // Both email and message are marked required in HTML5
    await expect(emailInput).toHaveAttribute("required", "");
    await expect(messageInput).toHaveAttribute("required", "");

    // Click submit with empty fields
    await submitBtn.click();

    // Form should not submit or show success state
    await expect(page.getByText("Received.")).not.toBeVisible();
  });

  test("contact form submission displays success feedback when API returns 200", async ({ page }) => {
    await page.goto("/contact");

    // Mock API response
    await page.route("/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.locator('input[name="name"]').fill("Jane Doe");
    await page.locator('input[name="email"]').fill("jane@example.com");
    await page.locator('input[name="organization"]').fill("Acme Corp");
    await page.locator('textarea[name="message"]').fill("We are looking for advice on pipeline architecture.");

    await page.locator('button[type="submit"]').click();

    await expect(page.getByText("Received.")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("We read every note and reply within one business day.")).toBeVisible();
  });

  test("contact form displays error message when API fails", async ({ page }) => {
    await page.goto("/contact");

    await page.route("/api/contact", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Server error occurred" }),
      });
    });

    await page.locator('input[name="email"]').fill("jane@example.com");
    await page.locator('textarea[name="message"]').fill("Hello there");
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText("Server error occurred")).toBeVisible({ timeout: 5000 });
  });

  test("direct API test for /api/contact endpoint validation", async ({ request }) => {
    // Missing required fields
    const resBad = await request.post("/api/contact", {
      data: { name: "Test" },
    });
    expect(resBad.status()).toBe(400);
    const jsonBad = await resBad.json();
    expect(jsonBad.error).toBe("Email and message are required.");

    // Invalid email format
    const resInvalidEmail = await request.post("/api/contact", {
      data: { email: "not-an-email", message: "Hello" },
    });
    expect(resInvalidEmail.status()).toBe(400);
    const jsonInvalid = await resInvalidEmail.json();
    expect(jsonInvalid.error).toBe("A valid email address is required.");

    // Valid submission (since no RESEND_API_KEY is configured, it falls back to console log and succeeds)
    const resOk = await request.post("/api/contact", {
      data: { email: "tester@example.com", message: "Test message" },
    });
    expect(resOk.status()).toBe(200);
    const jsonOk = await resOk.json();
    expect(jsonOk.ok).toBe(true);
  });
});

test.describe("Legal & 404 Pages", () => {
  test("/privacy page renders", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("h1")).toHaveText("Privacy policy");
    await expect(page.getByText("What we collect")).toBeVisible();
  });

  test("/terms page renders", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("h1")).toHaveText("Terms of use");
    await expect(page.getByText("Intellectual property")).toBeVisible();
  });

  test("non-existent page renders 404 with helpful navigation links", async ({ page }) => {
    const response = await page.goto("/non-existent-page-slug-xyz");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText("That page isn't here.");
    await expect(page.locator('a[href="/work"]')).toBeVisible();
    await expect(page.locator('a[href="/contact"]')).toBeVisible();
  });
});
