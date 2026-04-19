import { Languages } from "../types/languages";
import { ToolCategories } from "../types/tool-categories";
import { HomePage } from "./HomePage";
import { LoginPage } from "./LoginPage";

export class Header {

  private readonly homePageTestId = 'nav-home';
  private readonly categoriesTestId = 'nav-categories';
  private readonly contactsTestId = 'nav-contact';
  private readonly signinTestId = 'nav-sign-in';
  private readonly languageSelectTestId = 'language-select';
  private readonly cartTestId = 'nav-cart';

  private byTestId(testId: string) {
    return cy.findByTestId(testId);
  }

  private homePageLink() {
    return this.byTestId(this.homePageTestId);
  }

  private categoriesDropDown() {
    return this.byTestId(this.categoriesTestId);
  }

  private contactsLink() {
    return this.byTestId(this.contactsTestId);
  }

  private signinLink() {
    return this.byTestId(this.signinTestId);
  }

  private languageDropDown() {
    return this.byTestId(this.languageSelectTestId);
  }

  private activeDropdownMenu() {
    return cy.get('.dropdown-menu.show');
  }

  clickHomePage(): HomePage {
    this.homePageLink().click();
    return new HomePage();
  }

  clickCategoriesDropDown() {
    this.categoriesDropDown().click();
  }

  clickContacts() {
    this.contactsLink().click();
  }

  clickSignIn(): LoginPage {
    this.signinLink().click();

    return new LoginPage();
  }

  openLanguageDropdown() {
    this.languageDropDown().click();
  }

  selectLanguage(language: Languages) {
    this.openLanguageDropdown();
    this.activeDropdownMenu().contains(language).click();
  }

  selectToolsCategory(category: ToolCategories) {
    this.clickCategoriesDropDown();
    this.activeDropdownMenu().contains(category).click();
  }

  clickCart() {
    // using force click since the cart icon is covered by the pop-up when a product
    // is added to the cart, which causes the test to fail intermittently
    this.byTestId(this.cartTestId).click({force: true});
  }
}
