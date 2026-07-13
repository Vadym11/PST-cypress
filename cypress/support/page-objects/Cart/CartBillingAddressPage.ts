import { CreateUser } from "../../types/user";
import { CartBasePage } from "./CartBasePage";
import { CartPaymentPage } from "./CartPaymentPage";

export class CartBillingAddressPage extends CartBasePage {

    private readonly streetInputTestId = 'street';
    private readonly cityInputTestId = 'city';
    private readonly stateInputTestId = 'state';
    private readonly countryInputTestId = 'country';
    private readonly postalCodeInputTestId = 'postal_code';
    private readonly proceedToPaymentButtonTestId = 'proceed-3';
    
    fillBillingAddress(user: CreateUser): CartBillingAddressPage {
        cy.findByTestId(this.streetInputTestId).type(user.address.street);
        cy.findByTestId(this.cityInputTestId).type(user.address.city);
        cy.findByTestId(this.stateInputTestId).type(user.address.state);
        cy.findByTestId(this.postalCodeInputTestId).type(user.address.postal_code);
        cy.findByTestId(this.countryInputTestId).type(user.address.country);

        return this;
    }

    clickProceedToPayment(): CartPaymentPage {
        // using force click since the cart icon is covered by the pop-up when a product
        // is added to the cart, which causes the test to fail intermittently
        cy.findByTestId(this.proceedToPaymentButtonTestId).click({force: true});

        return new CartPaymentPage();
    }
}