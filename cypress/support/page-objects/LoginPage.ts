import { AccountPage } from "./AccountPage";

export class LoginPage {

    goTo(): LoginPage {
        cy.log('Navigating to login page');
        cy.visit('/auth/login');

        return this;
    }

    fillEmail(email: string): void {
        cy.findByTestId('email').type(email);
    }

    fillPassword(password: string): void {
        cy.findByTestId('password').type(password);
    }

    submit() {
        cy.findByTestId('login-submit').click().then(() => {
            cy.wait(5000);
        });
    }

    login(email: string, password: string): AccountPage {
        this.fillEmail(email);
        this.fillPassword(password);
        this.submit();

        return new AccountPage();
    }
}