const { defineConfig, devices } = require("@playwright/test");
module.exports = defineConfig({
  testDir: ".",
  testMatch: "graph-mvf.interactions.cjs",
  outputDir: "../output/playwright/results",
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4190",
    launchOptions: { executablePath: process.env.MVF_CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe" },
  },
  webServer: {
    command: "node graph-mvf-server.cjs",
    url: "http://127.0.0.1:4190/Wiredu2020/projects/multivector-incidence-routing/",
    reuseExistingServer: true,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
    { name: "mobile", use: { ...devices["iPhone 12"], defaultBrowserType: "chromium" } },
  ],
});
