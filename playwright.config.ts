import type { PlaywrightTestConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const config: PlaywrightTestConfig = {
  globalSetup: "./global-setup",
  globalTeardown: "./global-teardown",
  use: {
    baseURL: process.env.APP_URL,
    ignoreHTTPSErrors: true,
    trace: "on",
    extraHTTPHeaders: { playwright: "yes" },
  },
  retries: 1,
  workers: 1,
  reporter: [["list"], ["html"]],
  forbidOnly: !!process.env.CI, //This will fail if 'test.only' is committed to repo
};

export default config;
