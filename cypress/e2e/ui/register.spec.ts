import { ApiUser } from "../../support/api-models/user-api";
import { LoginPage } from "../../support/page-objects/LoginPage";
import { RegisterPage } from "../../support/page-objects/RegisterPage";
import { CreateUser } from "../../support/types/user";
import { generateRandomUserDataFaker } from "../../support/utils/test-utils"

describe('Register', () => {

    const apiUser = new ApiUser();
    let newUserData: CreateUser;
    let newUserId: string;

    before(() => {
        newUserData = generateRandomUserDataFaker();
    });

    after(() => {
        // Clean up - delete the created user via API
        if (!newUserId) {
            cy.log('Skipping cleanup — newUserId was never set, user may not have been created');
            return;
        }
        cy.getAdminCreds().then(({ email, password }) => {
            return apiUser.loginUser(email, password);
        }).then((res) => {
            const adminToken = res.body.access_token;
            return apiUser.deleteUser(newUserId, adminToken);
        });
    });

    it('should register new user', () => {
        cy.intercept('POST', '**/api/users/register').as('registerUser');

        const registerPage = new RegisterPage();

        registerPage
            .goTo()
            .enterRegistrationData(newUserData)
            .clickRegister();
        
        // Verify API response for user registration
        cy.wait('@registerUser').then(({response}) => {
            // Store the created user ID for cleanup
            newUserId = response!.body.id; 
            expect(response!.statusCode).to.equal(201);
            expect(response!.body).to.include({
                email: newUserData.email,
                first_name: newUserData.first_name,
                last_name: newUserData.last_name,
            });
        });

        // Verify redirection to login page after successful registration
        const loginPage = new LoginPage();
        loginPage.getPageHeader().should('have.text', 'Login');
        cy.location('pathname').should('equal', '/auth/login');
    })
})