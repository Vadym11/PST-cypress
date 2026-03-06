// function getUserCredentials() {
//     let email: string;
//     let password: string;
//     cy.env(['userEmail', 'userPassword']).then(({userEmail, userPassword}) => {
//       email = userEmail;
//       password = userPassword;
//       cy.log(`Email from env: ${email}`);
//       cy.log(`Password from env: ${password}`);
//     });

//     return { email, password };
// }

// export const userCreds = getUserCredentials();

export function loadUserCreds() {
    // Return the command chain so the test can wait for it
    return cy.env(['userEmail', 'userPassword']);
}

function getUrls() {
    const baseUrl = Cypress.config().baseUrl;
    let apiUrl: string;

    if (baseUrl.endsWith('4200')) {
      apiUrl = baseUrl.slice(0, baseUrl.length - 4) + '8091';
    } else if (baseUrl.endsWith('8080')) {
      apiUrl = `${baseUrl}/api`;
    } else {
      apiUrl = 'http://api.practicesoftwaretesting.com';
    }
    return { baseUrl, apiUrl };
}

export const urls = getUrls();
