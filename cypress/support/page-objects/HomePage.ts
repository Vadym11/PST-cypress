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
        cy.get('[data-test="product-name"]').first().click();

        return new ProductPage();
    }

    clickRandomPage(): HomePage {
        const randomPage = faker.number.int({min: 1, max: 5});

        if (randomPage != 1) {
            cy.get(`[aria-label="Page-${randomPage}"]`).click();
            cy.get(`[aria-label="Page-${randomPage}"]`).parent().should('have.class', 'active');
        }

        return this;
    }

    clickRandomProduct(): ProductPage {
        cy.get('.card')
            .not(':has([data-testid="out-of-stock"])')
            .filter(':not(:contains("Thor Hammer"))')
            .then(($elements) => {
                if ($elements.length === 0) {
                    throw new Error('No available products found matching criteria.');
                }

                const randomIndex = Math.floor(Math.random() * $elements.length);

                cy.wrap($elements).eq(randomIndex).click();
            });

        return new ProductPage(); 
    }

    selectRandomProduct(): ProductPage {
        this.clickRandomPage();
        // Wait for products to load after pagination
        cy.wait(500);

        return this.clickRandomProduct();
    }
}
