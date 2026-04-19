import { AccountPage } from "./AccountPage";

export class LoginPage {

    goTo(): LoginPage {
        cy.visit('/auth/login');

        return this;
    }

    getPageHeader() {
        return cy.get('h3');
    }

    fillEmail(email: string): void {
        cy.findByTestId('email').type(email);
    }

    fillPassword(password: string): void {
        cy.findByTestId('password').type(password);
    }

    submit() {
        cy.findByTestId('login-submit').click();
    }

    login(email: string, password: string): AccountPage {
        this.fillEmail(email);
        this.fillPassword(password);
        this.submit();

        // Wait for the account page header to be visible to ensure the page has loaded
        cy.findByRole('heading', { name: 'My account' }).should('be.visible');

        return new AccountPage();
    }
}