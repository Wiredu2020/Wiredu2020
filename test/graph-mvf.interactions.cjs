const { test, expect } = require("@playwright/test");
test("graph controls, stage playback, independent overlay, inspection and reset", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/Wiredu2020/projects/multivector-incidence-routing/");
  const mv = (id) => page.locator(`[data-mv="${id}"]`);
  await expect(mv("stage")).toContainText("Input graph");
  await expect(mv("graph")).toHaveCSS("border-top-width", "1px");
  await mv("preset").selectOption("c24");
  await expect(mv("block-summary")).toContainText("(24V, 24E)");
  await mv("preset").selectOption("c12s");
  await expect(mv("block-summary")).toContainText("(12V, 12E) (12V, 12E)");
  await mv("preset").selectOption("bridge");
  const output = await mv("readout").textContent();
  await mv("oracle").check();
  await expect(mv("readout")).toHaveText(output);
  await mv("next").click();
  await expect(mv("stage")).toContainText("Local GINE");
  await mv("previous").click();
  await expect(mv("stage")).toContainText("Input graph");
  await mv("speed").selectOption("800");
  await mv("play").click();
  await expect(mv("stage")).toContainText("Local GINE");
  await mv("play").click();
  await expect(mv("play")).toHaveText("Play");
  await mv("add-node").click();
  await expect(mv("readout")).toContainText("7 vertices");
  await mv("remove-node").selectOption("6");
  await mv("delete-node").click();
  await expect(mv("readout")).toContainText("6 vertices");
  await mv("from").selectOption("1");
  await mv("to").selectOption("1");
  await mv("toggle-edge").click();
  await expect(mv("error")).toContainText("Self-loops");
  await mv("to").selectOption("4");
  await mv("toggle-edge").click();
  await expect(mv("readout")).toContainText("8 edges");
  await mv("toggle-edge").click();
  await expect(mv("readout")).toContainText("7 edges");
  await mv("reset").click();
  await expect(mv("readout")).toContainText("7 edges");
  await mv("scores").locator("input").first().fill("0.9");
  await mv("scores").locator("input").first().dispatchEvent("change");
  for (let i = 0; i < 5; i++) {
    await mv("mode").selectOption(String(i));
    await expect(mv("readout")).toContainText("no trained prediction");
  }
  await mv("graph").getByRole("button").first().press("Enter");
  await expect(mv("details")).toContainText("Block:");
  await mv("reset").click();
  await expect(mv("scores").locator("input").first()).toHaveValue("0.5");
  await page.locator("img").first().scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator("img")
        .first()
        .evaluate((img) => img.naturalWidth)
    )
    .toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width);
  expect(errors).toEqual([]);
  await mv("scores").locator("input").last().fill("0.1");
  await mv("scores").locator("input").last().dispatchEvent("change");
  for (let i = 0; i < 5; i++) await mv("next").click();
  await page.screenshot({ path: `output/playwright/mvf-${test.info().project.name}.png`, fullPage: true });
});
test("reduced motion suppresses message dots and preserves manual stepping", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/Wiredu2020/projects/multivector-incidence-routing/");
  for (let i = 0; i < 5; i++) await page.locator('[data-mv="next"]').click();
  await expect(page.locator('[data-mv="stage"]')).toContainText("Soft transport");
  await expect(page.locator('[data-mv="graph"] circle[fill="#d68b00"]')).toHaveCount(0);
});
