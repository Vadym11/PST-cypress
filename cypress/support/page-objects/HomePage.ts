import { faker } from "@faker-js/faker";
import { BasePage } from "./BasePage";
import { Header } from "./HeaderComponent";
import { ProductPage } from "./ProductPage";

export class HomePage extends BasePage{
    readonly header = new Header();

    goTo(): HomePage {
        cy.visit('/');

        return this;
    }
    
    clickFirstProduct(): ProductPage {
        cy.findAllByTestId('product-name').first().click();

        return new ProductPage();
    }

    clickRandomPage(): HomePage {
        const randomPage = faker.number.int({min: 1, max: 5});

        cy.intercept('GET', '**/products**').as('productsReload');

        if (randomPage != 1) {
            cy.get(`[aria-label="Page-${randomPage}"]`).click();
        } else {
            cy.reload();
        }

        cy.wait('@productsReload');
        cy.get(`[aria-label="Page-${randomPage}"]`).parent().should('have.class', 'active');

        return this;
    }

    clickRandomProduct(): ProductPage {
        const filterProductSelectors = () => {
            return cy.get('.card')
                        .not(':has([data-test="out-of-stock"])')
                        .filter(':not(:contains("Thor Hammer"))');
        }

        filterProductSelectors()
        .then(($elements) => {
            if ($elements.length === 0) {
                throw new Error('No available products found matching criteria.');
            }
            const randomIndex = Math.floor(Math.random() * $elements.length);

            // Re-query fresh instead of using the stale wrapped reference
            filterProductSelectors()
                .eq(randomIndex)
                .click();
        });

        return new ProductPage(); 
    }

    selectRandomProduct(): ProductPage {
        this.clickRandomPage();

        return this.clickRandomProduct();
    }

    search(term: string): HomePage {
        cy.intercept('GET', '**/products/search**').as('searchResults');
        cy.findByTestId('search-query').clear().type(term);
        cy.findByTestId('search-submit').click();
        cy.wait('@searchResults');
        return this;
    }

    getProductNames(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.findAllByTestId('product-name');
    }

    getNoResultsMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.findByTestId('no-results');
    }
}
