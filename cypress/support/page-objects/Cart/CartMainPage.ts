import { CartBasePage } from "./CartBasePage";
import { CartSignInPage } from "./CartSignInPage";

export class CartMainPage extends CartBasePage {

    private readonly proceedToCheckoutButtonTestId = 'proceed-1';
    private readonly productTitleTestId = 'product-title';
    private readonly productQuantityTestId = 'product-quantity';
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
        // no data-test attribute exists on the delete button, so scope the click
        // to the correct row via product-title rather than relying on global button order
        cy.findAllByTestId(this.productTitleTestId).eq(index).parents('tr').find('.btn-danger').click();
        return this;
    }

    getCartTotal(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.findByTestId(this.cartTotalTestId);
    }

    getQuantityErrorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.findByRole('alert');
    }
}