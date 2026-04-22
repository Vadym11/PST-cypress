declare namespace Cypress {
  interface Chainable {
    getAdminCreds(): Chainable<{ email: string; password: string }>;
    loginViaApi(email: string, password: string): Chainable<void>;
  }
}
