import { ApiUser } from "../../support/api-models/user-api";
import { urls } from "../../support/utils/project-utils"
import { generateRandomUserData, generateRandomUserDataFaker } from "../../support/utils/test-utils";
import { getToken } from "../../support/utils/test-utils";

describe('USER API tests', () => {

    let adminEmail: string;
    let adminPassword: string;
    let adminToken: string;
    let apiUser: ApiUser;
    let userData: any;
    const baseUrl = urls.baseUrl;
    const apiUrl = urls.apiUrl;

    before(() => {    
        apiUser = new ApiUser();
        userData = generateRandomUserDataFaker();

        cy.getAdminCreds().then(({ email, password }) => {
            adminEmail = email;
            adminPassword = password;
            getToken(email, password).then((token) => {
                adminToken = token;
            });
        });
    })

    it('Get products', () => {
        cy.request(apiUrl + '/products').then((res) => {
            const resJson = JSON.stringify(res);
            cy.log(resJson);
        })
    })

    it('Register new user', () => {
        cy.readFile('./cypress/support/data/user-data.json').then((fileContent) => {
            const user = generateRandomUserData(fileContent);

            cy.log(`User email: ${user.email}`);
            cy.log(`User password: ${user.password}`);

            cy.request({
                method: 'POST',
                url: `${apiUrl}/users/login`,
                body: { email: adminEmail, password: adminPassword }
            }).then((res) => {

                const adminToken = res.body.access_token;

                cy.request({
                    method: 'POST',
                    url: `${apiUrl}/users/register`,
                    body: user,
                    headers: {
                            Authorization: `Bearer ${adminToken}`,
                    }
                }).then((res) => {
                    expect(res.status).to.eq(201);
                });
            })
        });
    })
})