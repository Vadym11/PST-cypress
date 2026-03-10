import { LoginPage } from "../../support/page-objects/LoginPage";
import { urls, loadUserCreds } from "../../support/utils/project-utils";

describe('Login', () => {
  let a = 'Initial value';
  let fixtureData: any;
  let userData: any;
  let email: string;
  let password: string;
  const baseUrl = urls.baseUrl;
  const apiUrl = urls.apiUrl;

  before(() => {
    loadUserCreds().then(({ userEmail, userPassword }) => {
      email = userEmail;
      password = userPassword;
    });    
  })

  beforeEach(() => {
    // cy.visit('/');
    a = 'Before each value';
    cy.fixture('products').then((data) => {
     fixtureData = data;
      // cy.log(`Fixture data: ${JSON.stringify(fixtureData)}`);
    });
    cy.fixture('me').then((data) => {
      userData = data;
      // cy.log(`User data: ${JSON.stringify(userData)}`);
    });
  });

  it('should display the login form', () => {
    cy.visit('/');
    cy.get('[data-test="nav-sign-in"]').click();
    cy.get('#email').as('email').should('be.visible').type(email);
    cy.get('#password').as('password').should('be.visible').type(password);

    cy.get('[data-test="login-submit"]').should('be.visible').click();

    // cy.get('h1').should('have.text', 'My account').debug();

    cy.get('[data-test="nav-favorites"]').then(($element) => {
      cy.log(`Element text: ${$element.text()}`);
      cy.log(`Before reassigning, variable a: ${a}`);
      a = $element.text();
      cy.log(`Variable after reassignment 1: ${a}`);
      cy.wrap($element).should('contain.text', 'Favorites');
    });

    cy.log(`Variable after reassignment 2: ${a}`);
  });

  it('should display the login form when navigating directly to /auth/login', () => {
    cy.log(`Variable in a different test: ${a}`);

    cy.visit('/auth/login');
    cy.findByTestId('email').should('be.visible').type(email);
    cy.findByTestId('password').should('be.visible').type(password);
    cy.findByTestId('login-submit').should('be.visible').click();

    cy.url().should('include', '/auth/login');
  });

  it.skip('should return array of products', () => {
    cy.log(`Base URL: ${baseUrl}`);
    
    cy.log(`Email from fixture: ${fixtureData.email}`);
    cy.request(apiUrl).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(`Response body: ${JSON.stringify(response.body)}`);
      cy.writeFile('cypress/fixtures/products.json', response.body);
      expect(response.body['data']).to.be.an('array');
    });
  });

  it.skip('pulls data from fixture file', () => {
    cy.fixture('products').then((data) => {
      cy.log(`Email from fixture inside test: ${data.data[0].id}`);
    });
  });

  it('intercept example', () => {
    cy.intercept('GET', '**/products?*', fixtureData).as('getProducts');
    cy.visit('/');
    cy.wait('@getProducts').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      cy.log(`Intercepted response body: ${JSON.stringify(interception.response.body)}`);
    });

    cy.get('.card').eq(0).findByTestId('product-price').should('have.text', '$99.99');
  });

  it('intercept current user', () => {
    // const baseUrl = Cypress.config().baseUrl;
    cy.log(`Base URL: ${baseUrl}`);
    cy.intercept('GET', '**/me', userData).as('currentUser');
    cy.visit('/');
    cy.wait('@currentUser').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      cy.log(`Intercepted response body: ${JSON.stringify(interception.response.body)}`);
    });

    cy.visit('/account/profile');

    // cy.wait(5000);

    // cy.get('.card').eq(0).findByTestId('product-price').should('have.text', '$99.99');
  });

  it('happy path', () => {
    const loginPage = new LoginPage();
    const pageTitle = 'My account';
    const infoMessage = 'Here you can manage your profile, favorites and orders.';
    const navButtonsTexts = ['Favorites', 'Profile', 'Invoices', 'Messages'];

    loginPage
      .goTo()
      .login(email, password)
      .verifyAccountPage(pageTitle, infoMessage, navButtonsTexts);
  });
});