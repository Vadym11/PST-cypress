import dotenv from 'dotenv';
const { defineConfig } = require("cypress");
dotenv.config();
const BASE_URL = process.env.BASE_URL || 'https://practicesoftwaretesting.com';

module.exports = defineConfig({
  // dissallow deprecated Cypress.env() usage in tests
  allowCypressEnv: false,
  env: {
    // Map .env variables to Cypress env variables
    adminEmail: process.env.ADMIN_USER_EMAIL,
    adminPassword: process.env.ADMIN_USER_PASSWORD,
    userEmail: process.env.USER_EMAIL,
    userPassword: process.env.USER_PASSWORD,
    passwordReset: process.env.FORGOT_PASSWORD,
  },
  e2e: {
    baseUrl: BASE_URL,
    video: process.env.CYPRESS_VIDEO === 'true',
    setupNodeEvents(on, config) {
      // Keep snapshots in interactive mode (`cypress open`) and
      // optimize memory in terminal mode (`cypress run`).
      config.numTestsKeptInMemory = config.isTextTerminal ? 0 : 50;
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-gpu');
        }
        return launchOptions;
      });
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      return config;
    },
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}'
  },
});
