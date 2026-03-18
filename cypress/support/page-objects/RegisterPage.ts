import { CreateUser } from "../types/user";

export class RegisterPage {

    goTo(): RegisterPage {
        cy.visit('auth/register');

        return this;
    }

    getPageHeader() {
        return cy.get('h3');
    }

    enterRegistrationData(user: CreateUser): RegisterPage {
        cy.findByTestId('first-name').type(user.first_name);
        cy.findByTestId('last-name').type(user.last_name);
        cy.findByTestId('email').type(user.email);
        cy.findByTestId('password').type(user.password);
        cy.findByTestId('phone').type(user.phone);
        cy.findByTestId('dob').type(user.dob);
        cy.findByTestId('street').type(user.address.street);
        cy.findByTestId('city').type(user.address.city);
        cy.findByTestId('state').type(user.address.state);
        cy.findByTestId('country').select(user.address.country);
        cy.findByTestId('postal_code').type(user.address.postal_code);

        return this;
    }

    clickRegister() {
        cy.findByTestId('register-submit').click();
    }
}