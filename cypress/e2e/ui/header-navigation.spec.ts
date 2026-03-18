import { Header } from "../../support/page-objects/HeaderComponent";
import { Languages } from "../../support/types/languages";
import { ToolCategories } from "../../support/types/tool-categories";

describe.skip('Header navigation', () => {

    beforeEach(() => {
        cy.visit('/');
    })

    it('should click home page link', () => {
        const header = new Header();

        header.clickHomePage();
    })

    it('should select categories', () => {
        const header = new Header();
        const category = ToolCategories.HandTools;

        header.selectToolsCategory(category);

        cy.get('h2').should('have.text', `Category: ${category}`);
    })

    it('should click contact', () => {
        const header = new Header();

        header.clickContacts();

        cy.get('h3').should('have.text', 'Contact');
    })

    it('should click sign in link', () => {
        const header = new Header();

        header.clickSignIn();

        cy.get('h3').should('have.text', 'Login');
    })

    it('should click languages drop down', () => {
        const header = new Header();

        header.selectLanguage(Languages.Spanish);

        cy.findByTestId('nav-home').should('have.text', 'Inicio');
    })
})