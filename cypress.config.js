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
    numTestsKeptInMemory: 0,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-gpu');
        }
        return launchOptions;
      });
    },
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}'
  },
});
