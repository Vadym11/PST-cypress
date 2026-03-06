import { Languages } from "../types/languages";
import { ToolCategories } from "../types/tool-categories";

export class Header {

  private readonly homePageTestId = 'nav-home';
  private readonly categoriesTestId = 'nav-categories';
  private readonly contactsTestId = 'nav-contact';
  private readonly signinTestId = 'nav-sign-in';
  private readonly languageSelectTestId = 'language-select';

  private get homePageLink() {
    return cy.findByTestId(this.homePageTestId);
  }

  private categoriesDropDown() {
    return cy.findByTestId(this.categoriesTestId);
  }

  private contactsLink() {
    return cy.findByTestId(this.contactsTestId);
  }

  private signinLink() {
    return cy.findByTestId(this.signinTestId);
  }

  private languageDropDown() {
    return cy.findByTestId(this.languageSelectTestId);
  }

  clickHomePage() {
    this.homePageLink.click();
  }

  clickCategoriesDropDown() {
    this.categoriesDropDown().click();
  }

  clickContacts() {
    this.contactsLink().click();
  }

  clickSignIn() {
    this.signinLink().click();
  }

  openLanguageDropdown() {
    this.languageDropDown().click();
  }

  clickLanguage(language: string) {
    cy.findByText(language).click();
  }

  selectLanguage(language: Languages) {
    this.openLanguageDropdown();
    cy.findByText(language).click();
  }

  selectToolsCategory(category: ToolCategories) {
    this.clickCategoriesDropDown();
    cy.get('.dropdown-item').findByText(category).click();
  }
}
