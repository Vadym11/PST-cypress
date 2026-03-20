import { ApiUser } from "../../support/api-models/user-api";
import { CreateUser } from "../../support/types/user";
import { generateRandomUserDataFaker } from "../../support/utils/test-utils";
import { faker } from "@faker-js/faker";

describe('User API Tests', () => {

    let newPasswordReset: string;
    let newPasswordChanged: string;
    const newFirstName = faker.person.firstName().replaceAll("'", '');
    const newLastName = faker.person.lastName().replaceAll("'", '');
    const newEmail = `${newFirstName}.${newLastName}@gmail.com`.toLowerCase();
    let adminToken: string;
    let apiUser: ApiUser;
    let userData: CreateUser;
    let userToken: string;
    let userId: string;

    before(() => {    
        apiUser = new ApiUser();
        userData = generateRandomUserDataFaker();

        cy.getAdminCreds().then(({ email, password }) => {
            apiUser.loginUser(email, password).then((response) => {
                adminToken = response.body.access_token;
            });
        });

        cy.env(['passwordReset']).then(({passwordReset}) => {
            newPasswordReset = passwordReset;
        });
    })

    it('should get all users', () => {
        apiUser.getAllUsers(adminToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.data).to.be.an('array');
        });
    });

    it('should register new user', () => {
        apiUser.registerUser(userData).then((res) => {
            expect(res.status).to.eq(201);
            expect(res.body).to.include({
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
            });
        });
    });

    it('should login user', () => {
        apiUser.loginUser(userData.email, userData.password).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('access_token');
            userToken = res.body.access_token;
        });
    });

    it('should change user password', () => {   
        newPasswordChanged = faker.internet.password({ length: 12, memorable: false, pattern: /[A-Za-z0-9!@#$%^&*()]/ });
        cy.log('newPasswordReset value: ' + newPasswordReset); 
        cy.log('userToken: ' + userToken);

        apiUser.changePassword(userData.password, newPasswordChanged, userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('success', true);
        });
    });

    it('should login user with changed password', () => {
        apiUser.loginUser(userData.email, newPasswordChanged).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('access_token');
            userToken = res.body.access_token;
        });
    });

    it('should get current user data', () => {
        apiUser.getCurrentUser(userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.include({
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
            });
            userId = res.body.id;
        });
    });

    it('should reset forgotten password', () => {
        apiUser.forgotPassword(userData.email).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('success', true);
        });

        cy.log(`New password for user ${userData.email}: ${newPasswordReset}`);
    });

    it('should login user with new password', () => {
        apiUser.loginUser(userData.email, newPasswordReset).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('access_token');
            userToken = res.body.access_token;
            cy.log(`Token after password reset: ${userToken}`);
        });
    });

    it('should refresh token', () => {
        apiUser.refreshToken(userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('access_token');
            expect(res.body).to.have.property('expires_in');
            expect(res.body).to.have.property('token_type', 'bearer');
            userToken = res.body.access_token;
        });
    });

    it('should get user info by id', () => {
        apiUser.getById(userId, userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.include({
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
            });
        });
    });

    it('should update user info', () => {
        userData.first_name = newFirstName;
        userData.last_name = newLastName;

        apiUser.updateInfo(userId, userData, userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('success', true);
        });
    });

    it('should partially update user info', () => {
        const updatedData = { email: newEmail};

        apiUser.partiallyUpdateInfo(userId, updatedData, userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('success', true);
        });
    });

    it('should logout user', () => {
        apiUser.logoutUser(userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('message', 'Successfully logged out');
        });
    });
})