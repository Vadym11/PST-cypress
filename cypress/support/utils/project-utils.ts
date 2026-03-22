export function loadUserCreds() {
    // Return the command chain so the test can wait for it
    return cy.env(['userEmail', 'userPassword']);
}

export function loadAdminCreds() {
    // Return the command chain so the test can wait for it
    return cy.env(['adminEmail', 'adminPassword']);
}

function getUrls() {
    const baseUrl = Cypress.config().baseUrl;
    let apiUrl: string;

    if (baseUrl.endsWith('4200')) {
      apiUrl = baseUrl.slice(0, baseUrl.length - 4) + '8091';
    } else if (baseUrl.endsWith('80')) {
      apiUrl = `${baseUrl}/api`;
    } else {
      apiUrl = 'https://api.practicesoftwaretesting.com';
    }
    return { baseUrl, apiUrl };
}

export const urls = getUrls();
