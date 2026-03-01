describe('Login', () => {
  let a = 'Initial value';

  beforeEach(() => {
    cy.visit('/');
    a = 'Before each value';
  });

  it('should display the login form', () => {
    cy.get('[data-test="nav-sign-in"]').click();
    cy.get('#email').as('email').should('be.visible').type('customer2@practicesoftwaretesting.com');
    cy.get('#password').as('password').should('be.visible').type('welcome01');

    cy.get('[data-test="login-submit"]').should('be.visible').click();

    cy.get('h1').should('have.text', 'My account').debug();

    cy.get('[data-test="nav-favorites"]').then(($element) => {
      cy.log(`Element text: ${$element.text()}`);
      cy.log(`Before reassigning, variable a: ${a}`);
      a = $element.text();
      cy.log(`Variable after reassignment 1: ${a}`);
      cy.wrap($element).should('contain.text', 'Favorites');
    });

    cy.log(`Variable after reassignment 2: ${a}`);

    cy.wait(1000); // Wait for the page to load completely
  });

  it('should display the login form when navigating directly to /auth/login', () => {
    cy.log(`Variable in a different test: ${a}`);

    cy.visit('localhost:8080/auth/login');
    cy.get('[data-test="email"]').should('be.visible').type('customer2@practicesoftwaretesting.com');
    cy.get('[data-test="password"]').should('be.visible').type('welcome01');
    cy.get('[data-test="login-submit"]').should('be.visible').click();

    cy.url().should('include', '/auth/login');
  });
});