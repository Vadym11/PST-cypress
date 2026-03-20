import { LoginPage } from "../../support/page-objects/LoginPage";
import { RegisterPage } from "../../support/page-objects/RegisterPage";
import { CreateUser } from "../../support/types/user";
import { generateRandomUserDataFaker } from "../../support/utils/test-utils"

describe('Register', () => {

    let newUserData: CreateUser;

    before(() => {
        newUserData = generateRandomUserDataFaker();
    })

    it('should register new user', () => {
        cy.intercept('POST', '**/api/users/register').as('registerUser');

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
        cy.location('pathname').should('equal', '/auth/login');
    })
})