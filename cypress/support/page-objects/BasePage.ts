import { HomePage } from "./HomePage";

export class BasePage {
    constructor() {
    }

    goToHomePage() {
        cy.visit('/');
        }
}
