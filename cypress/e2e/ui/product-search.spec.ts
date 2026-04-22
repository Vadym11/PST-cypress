import { HomePage } from "../../support/page-objects/HomePage";

describe('Product search', () => {

    const homePage = new HomePage();

    beforeEach(() => {
        cy.env(['userEmail', 'userPassword']).then(({ userEmail, userPassword }) => {
            cy.loginViaApi(userEmail, userPassword);
        });
        homePage.goTo();
    });

    it('should display products matching the search term', () => {
        homePage.search('Pliers');

        homePage.getProductNames().should('have.length.greaterThan', 0);
        homePage.getProductNames().each(($el) => {
            expect($el.text().toLowerCase()).to.include('pliers');
        });
    });

    it('should display products for a partial search term', () => {
        homePage.search('Ham');

        homePage.getProductNames().should('have.length.greaterThan', 0);
        homePage.getProductNames().each(($el) => {
            expect($el.text().toLowerCase()).to.include('ham');
        });
    });

    it('should show no results message for an unmatched search query', () => {
        homePage.search('xyznotaproduct123');

        homePage.getNoResultsMessage().should('be.visible');
    });

    it('should restore all products after navigating back to home', () => {
        homePage.search('Pliers');
        homePage.getProductNames().should('have.length.greaterThan', 0).then(($filtered) => {
            const filteredCount = $filtered.length;

            homePage.header.clickHomePage();

            homePage.getProductNames().should('have.length.greaterThan', filteredCount);
        });
    });
});
