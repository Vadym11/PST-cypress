import { LoginPage } from "../../support/page-objects/LoginPage";

describe('Login', () => {
  let email: string;
  let password: string;
  const loginPage = new LoginPage();
  const pageTitle = 'My account';
  const infoMessage = 'Here you can manage your profile, favorites and orders.';
  const navButtonsTexts = ['Favorites', 'Profile', 'Invoices', 'Messages'];

  before(() => {    
    cy.env(['userEmail', 'userPassword']).then(({userEmail, userPassword}) => {
      expect(userEmail, 'userEmail env var must be set').to.exist;
      expect(userPassword, 'userPassword env var must be set').to.exist;
      email = userEmail;
      password = userPassword;
    })
  })

  it('should login successfully', () => {
    loginPage
      .goTo()
      .login(email, password)
      .verifyAccountPage(pageTitle, infoMessage, navButtonsTexts);
  });
});