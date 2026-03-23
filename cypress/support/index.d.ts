declare namespace Cypress {
  interface Chainable {
    getAdminCreds(): Chainable<{ email: string; password: string }>;
  }
}
