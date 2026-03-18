import { LoginPage } from "../../support/page-objects/LoginPage";
import { RegisterPage } from "../../support/page-objects/RegisterPage";
import { generateRandomUserDataFaker } from "../../support/utils/test-utils"

describe('Register', () => {

    it('should register new user', () => {
        cy.intercept('POST', '**/api/users/register').as('registerUser');

        const newUserData = generateRandomUserDataFaker();

        const registerPage = new RegisterPage();

        registerPage
            .goTo()
            .enterRegistrationData(newUserData)
            .clickRegister();
        
        cy.wait('@registerUser').then(({response}) => {
            expect(response.statusCode).to.equal(201);
            expect(response.body).to.include({
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