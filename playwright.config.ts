import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";
const baseUrl = new URL(baseURL);
const devServerPort = baseUrl.port || "3000";
baseUrl.port = devServerPort;
const webServerUrl = baseUrl.toString();

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: webServerUrl,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm run dev -- --hostname 0.0.0.0 --port ${devServerPort}`,
    url: webServerUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
