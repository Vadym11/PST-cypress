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
  },
  e2e: {
    baseUrl: BASE_URL,
    setupNodeEvents(on, config) {
      // this is needed to avoid 403 Forbidden errors when running tests in Chrome
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push(
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
          );
        }
        return launchOptions;
      });
    },
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}'
  },
});
