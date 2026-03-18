import { AccountPage } from "./AccountPage";

export class LoginPage {

    goTo(): LoginPage {
        cy.log('Navigating to login page');
        cy.visit('/auth/login', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

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