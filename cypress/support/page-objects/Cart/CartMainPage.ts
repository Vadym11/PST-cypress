import { CartBasePage } from "./CartBaseBage";
import { CartSignInPage } from "./CartSignInPage";

export class CartMainPage extends CartBasePage {

    private readonly proceedToCheckoutButtonTestId = 'proceed-1';

    clickProceedToCheckout() {
        cy.findByTestId(this.proceedToCheckoutButtonTestId).click();

        return new CartSignInPage();
    }
}