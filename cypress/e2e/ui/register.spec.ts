import { LoginPage } from "../../support/page-objects/LoginPage";
import { RegisterPage } from "../../support/page-objects/RegisterPage";
import { generateRandomUserDataFaker } from "../../support/utils/test-utils"

describe('Register', () => {

    it('should register new user', () => {
        const newUserData = generateRandomUserDataFaker();

        const registerPage = new RegisterPage();

        cy.intercept('POST', '**/api/users/register').as('registerUser');

        registerPage
            .goTo()
            .enterRegistrationData(newUserData)
            .clickRegister();
        
        cy.wait('@registerUser').then((interception) => {
            expect(interception.response?.statusCode).to.equal(201);
            expect(interception.response?.body).to.deep.include({
                email: newUserData.email,
                first_name: newUserData.first_name,
                last_name: newUserData.last_name,
            });
        });

        const loginPage = new LoginPage();

        loginPage.getPageHeader().should('have.text', 'Login');
        cy.url().should('include', '/auth/login');
    })
})