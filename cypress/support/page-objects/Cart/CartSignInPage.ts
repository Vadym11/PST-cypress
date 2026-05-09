import { CreateUser } from "../../types/user";
import { CartBasePage } from "./CartBaseBage";
import { CartBillingAddressPage } from "./CartBillingAddressPage";

export class CartSignInPage extends CartBasePage {
    private readonly emailInputTestId = 'email';
    private readonly passwordInputTestId = 'password';
    private readonly guestEmailInputTestId = 'guest-email';
    private readonly guestFirstNameInputTestId = 'guest-first-name';
    private readonly guestLastNameInputTestId = 'guest-last-name';
    private readonly continueAsGuestButtonTestId = 'guest-submit';
    private readonly logInButtonTestId = 'login-submit';
    private readonly proceedToBilling = 'proceed-2';
    private readonly proceedToBillingAsGuestButtonTestId = 'proceed-2-guest';

    fillEmail(email: string): void {
        cy.findByTestId(this.emailInputTestId).type(email);
    }

    fillPassword(password: string): void {
        cy.findByTestId(this.passwordInputTestId).type(password);
    }

    clickLogin(): void {
        cy.findByTestId(this.logInButtonTestId).click();
    }
    
    login(user: CreateUser): CartSignInPage {
        const helloMessage = 
            `Hello ${user.first_name} ${user.last_name}, you are already logged in. You can proceed to checkout.`;
        
        this.fillEmail(user.email);
        this.fillPassword(user.password);
        this.clickLogin();
        cy.contains(helloMessage).should('be.visible');

        return this;
    }

    fillGuestEmail(email: string): CartSignInPage {
        cy.findByTestId(this.guestEmailInputTestId).type(email);
        return this;
    }

    fillGuestFirstName(firstName: string): CartSignInPage {
        cy.findByTestId(this.guestFirstNameInputTestId).type(firstName);
        return this;
    }

    fillGuestLastName(lastName: string): CartSignInPage {
        cy.findByTestId(this.guestLastNameInputTestId).type(lastName);
        return this;
    }

    clickContinueAsGuest(): CartSignInPage {
        cy.findByTestId(this.continueAsGuestButtonTestId).click();

        return this;
    }

    clickProceedToBillingAsGuest(): CartBillingAddressPage {
        cy.findByTestId(this.proceedToBillingAsGuestButtonTestId).click();

        return new CartBillingAddressPage();
    }

    clickProceedToBilling(): CartBillingAddressPage {
        cy.findByTestId(this.proceedToBilling).click();

        return new CartBillingAddressPage();
    }

    switchToContinueAsGuest(): CartSignInPage {
        cy.findByRole('tab', { name: 'Continue as Guest' }).click();
        return this;
    }

    switchToSignInForm() {
        cy.findByRole('tab', { name: 'Sign In' }).click();
    }

    assertSignInPageVisible(): CartSignInPage {
        cy.findByTestId(this.logInButtonTestId).should('be.visible');
        return this;
    }
}