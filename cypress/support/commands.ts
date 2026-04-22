// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('getAdminCreds', () => {
  cy.env(['adminEmail', 'adminPassword']).then(({adminEmail, adminPassword}) => {
    cy.wrap({ email: adminEmail, password: adminPassword });
  });
});

// In cypress/support/commands.ts
Cypress.Commands.add('loginViaApi', (email: string, password: string) => {
  cy.session(
    [email, password],
    () => {
      cy.request('POST', 'api/users/login', {
        email,
        password
      }).then(({ body }) => {
        // This sets it in the app's window, not Cypress runner's
        cy.window().then((win) => {
          win.localStorage.setItem('auth-token', body.access_token)
        })
      })
    },
    {
     validate: () => {
        cy.request({
          method: 'GET',
          url: '/users/me',        // a cheap authenticated endpoint
          failOnStatusCode: false
        }).its('status').should('eq', 200)
      }
    }
  )
})