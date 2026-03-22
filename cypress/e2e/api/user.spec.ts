import { ApiUser } from "../../support/api-models/user-api";
import { CreateUser } from "../../support/types/user";
import { generateRandomUserDataFaker } from "../../support/utils/test-utils";
import { faker } from "@faker-js/faker";

describe('User API Tests', () => {
    const apiUser: ApiUser = new ApiUser();
    const newFirstName = faker.person.firstName().replaceAll("'", '');
    const newLastName = faker.person.lastName().replaceAll("'", '');
    const newEmail = `${newFirstName}.${newLastName}.${Date.now()}@gmail.com`.toLowerCase();
    const newPasswordChanged = `Ab1&${Date.now()}${faker.string.alphanumeric(6)}`;
    let adminToken: string;
    let userToken: string;
    let originalUserData: CreateUser;
    let currentUserData: CreateUser;
    let userId: string;
    let newPasswordReset: string;
    
    before(() => {    
        originalUserData = generateRandomUserDataFaker();
        currentUserData = { ...originalUserData };

        return cy.env(['passwordReset']).then(({passwordReset}) => {
            newPasswordReset = passwordReset;
            return cy.getAdminCreds();
        }).then(({ email, password }) => {
            return apiUser.loginUser(email, password);
        })
        .then((res) => {
            expect(res.status).to.eq(200);
            adminToken = res.body.access_token;
            return apiUser.registerUser(originalUserData);
        })
        .then((res) => {
            expect(res.status).to.eq(201);
            userId = res.body.id;
            return apiUser.loginUser(originalUserData.email, originalUserData.password);
        })
        .then((res) => {
            expect(res.status).to.eq(200);
            userToken = res.body.access_token;
        });
    });

    beforeEach(() => {
        return apiUser.loginUser(currentUserData.email, currentUserData.password).then((res) => {
            expect(res.status).to.eq(200);
            userToken = res.body.access_token;
        });
    });

    after(() => {
        return apiUser.deleteUser(userId, adminToken).then((res) => {
            expect(res.status).to.eq(204);
            return apiUser.getById(userId, adminToken, false);
        }).then((res) => {
            expect(res.status).to.eq(404);
            expect(res.body).to.have.property('error', `No query results for model [App\\Models\\User] ${userId}`);
        });
    });

    it('should get all users', () => {
        apiUser.getAllUsers(adminToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.data).to.be.an('array');
        });
    });

    it('should get current user info', () => {
        apiUser.getCurrentUser(userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.include({
                email: currentUserData.email,
                first_name: currentUserData.first_name,
                last_name: currentUserData.last_name,
            });
        });
    });

    it('should change user password and login', () => {   
        apiUser.changePassword(currentUserData.password, newPasswordChanged, userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('success', true);
            return apiUser.loginUser(currentUserData.email, newPasswordChanged);
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('access_token');
            currentUserData.password = newPasswordChanged;
        });
    });

    it('should reset forgotten password and login', () => {
        apiUser.forgotPassword(currentUserData.email).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('success', true);
            return apiUser.loginUser(currentUserData.email, newPasswordReset);
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('access_token');
            currentUserData.password = newPasswordReset;
        });
    });

    it('should refresh token', () => {
        apiUser.refreshToken(userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('access_token');
            expect(res.body).to.have.property('expires_in');
            expect(res.body).to.have.property('token_type', 'bearer');
        });
    });

    it('should get user info by id', () => {
        apiUser.getById(userId, userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.include({
                email: currentUserData.email,
                first_name: currentUserData.first_name,
                last_name: currentUserData.last_name,
            });
        });
    });

    it('should update user info', () => {
        currentUserData.first_name = newFirstName;
        currentUserData.last_name = newLastName;

        apiUser.updateInfo(userId, currentUserData, userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('success', true);
            return apiUser.getCurrentUser(userToken);
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.include({
                email: currentUserData.email,
                first_name: currentUserData.first_name,
                last_name: currentUserData.last_name,
            });
        });
    });

    it('should partially update user info', () => {
        apiUser.partiallyUpdateInfo(userId, {email: newEmail}, userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('success', true);
            return apiUser.getCurrentUser(userToken);
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.include({
                email: newEmail,
                first_name: currentUserData.first_name,
                last_name: currentUserData.last_name,
            });
            currentUserData.email = newEmail;
        });
    });

    it('should logout user', () => {
        apiUser.logoutUser(userToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('message', 'Successfully logged out');
        });
    });
})