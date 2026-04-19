import { BasePage } from "./BasePage";
import { CartMainPage } from "./Cart/CartMainPage";
import { Header } from "./HeaderComponent";

export class ProductPage extends BasePage {

    readonly header: Header;
    private readonly addToCartButtonTestId = 'add-to-cart';
    private readonly addToFavoritesButtonTestId = 'add-to-favorites';

    constructor() {
        super();
        this.header = new Header();
    }

    clickAddToCart(): ProductPage {
        cy.findByTestId(this.addToCartButtonTestId).click();

        return this;
    }

    getAddedToCartPopUp(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.findAllByRole('alert', { name: 'Product added to shopping cart.' });
    }

    clickAddToCartAndAssertPopUps(count: number = 1): ProductPage {
        for (let i = 0; i < count; i++) {
            this.clickAddToCart();
            this.getAddedToCartPopUp()
                .last()
                .should('be.visible');
        }

        return this;
    }

    addToFavorites() {
        cy.findByTestId(this.addToFavoritesButtonTestId).click();
    }

    goToCart() {
        this.header.clickCart();

        return new CartMainPage();
    }
}