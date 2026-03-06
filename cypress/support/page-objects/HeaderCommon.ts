import { Languages } from "../types/languages";
import { ToolCategories } from "../types/tool-categories";

export class Header{

    private readonly homePageLink: any;
    private readonly categoriesDropDown: any;
    private readonly contactsLink: any;
    private readonly signinLink: any;
    private readonly languageDropDown: any;

    constructor() {
        this.homePageLink = cy.findByTestId('nav-home');
        this.categoriesDropDown = cy.findByTestId('nav-categories');
        this.contactsLink = cy.findByTestId('nav-contact');
        this.signinLink = cy.findByTestId('nav-sign-in');
        this.languageDropDown = cy.findByTestId('language-select');
    }

    clickHomePage() {
        this.homePageLink.click();
    }

    clickCategoriesDropDown() {
        this.categoriesDropDown.click();
    }

    clickContacts() {
        this.contactsLink.click();
    }

    clickSignIn() {
        this.signinLink.click();
    }

    clickLanguagesDropDown() {
        this.languageDropDown.click();
    }

    clickLanguage(laguage: string) {
        cy.findByText(laguage).click();
    }

    selectLanguage(languages: Languages) {
        this.clickLanguagesDropDown();
        cy.findByText(languages).click();
    }

    selectToolsCategory(category: ToolCategories) {
        this.clickCategoriesDropDown();
        cy.get('.dropdown-item').findByText(category).click();
    }

}