import { CartBasePage } from "./CartBaseBage";
import { CartSignInPage } from "./CartSignInPage";

export class CartMainPage extends CartBasePage {

    private readonly proceedToCheckoutButtonTestId = 'proceed-1';
    private readonly productTitleTestId = 'product-title';
    private readonly productQuantityTestId = 'product-quantity';
    private readonly deleteProductButtonTestId = 'delete-product';
    private readonly cartTotalTestId = 'cart-total';

    clickProceedToCheckout() {
        // using force click since the cart icon is covered by the pop-up when a product
        // is added to the cart, which causes the test to fail intermittently
        cy.findByTestId(this.proceedToCheckoutButtonTestId).click({force: true});

        return new CartSignInPage();
    }

    getProductTitles(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.findAllByTestId(this.productTitleTestId);
    }

    getProductQuantityInputByIndex(index: number): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.findAllByTestId(this.productQuantityTestId).eq(index);
    }

    updateProductQuantityByIndex(index: number, newQuantity: number): CartMainPage {
        cy.findAllByTestId(this.productQuantityTestId).eq(index).focus().type('{selectall}' + String(newQuantity)).blur();
        return this;
    }

    removeProductByIndex(index: number): CartMainPage {
        cy.get('.btn.btn-danger').eq(index).click();
        return this;
    }

    getCartTotal(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.findByTestId(this.cartTotalTestId);
    }

    getQuantityErrorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.findByRole('alert');
    }
}