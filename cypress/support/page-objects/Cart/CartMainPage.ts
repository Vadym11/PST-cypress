import { CartBasePage } from "./CartBaseBage";
import { CartSignInPage } from "./CartSignInPage";

export class CartMainPage extends CartBasePage {

    private readonly proceedToCheckoutButtonTestId = 'proceed-1';

    clickProceedToCheckout() {
        // using force click since the cart icon is covered by the pop-up when a product
        // is added to the cart, which causes the test to fail intermittently
        cy.findByTestId(this.proceedToCheckoutButtonTestId).click({force: true});

        return new CartSignInPage();
    }
}