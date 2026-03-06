export class BasePage {
    constructor() {
    }

    goToHomePage() {
        cy.visit('/');
    }
}
