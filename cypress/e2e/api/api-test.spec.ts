import { loadAdminCreds, urls } from "../../support/utils/project-utils"
import { generateRandomUserData } from "../../support/utils/test-utils";

describe.skip('API tests', () => {

    let email: string;
    let password: string;
    const baseUrl = urls.baseUrl;
    const apiUrl = urls.apiUrl;

    before(() => {
        loadAdminCreds().then(({ adminEmail, adminPassword }) => {
            email = adminEmail;
            password = adminPassword;
            cy.log(`Admin email: ${adminEmail}`);
            cy.log(`Admin pass: ${adminPassword}`);
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
                body: { email, password }
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