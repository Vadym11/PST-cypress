// export function getUrls() {
//     const baseUrl = Cypress.config().baseUrl;
//     let apiUrl: string;

//     if (baseUrl.endsWith('4200')) {
//       apiUrl = baseUrl.slice(0, baseUrl.length - 4) + '8091';
//     } else if (baseUrl.endsWith('8080')) {
//       apiUrl = `${baseUrl}/api`;
//     } else {
//       apiUrl = 'http://api.practicesoftwaretesting.com';
//     }
//     return { baseUrl, apiUrl };
// }

// export const urls = getUrls();