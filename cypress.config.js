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
    // this is needed to avoid 403 Forbidden errors
    headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    baseUrl: BASE_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}'
  },
});
