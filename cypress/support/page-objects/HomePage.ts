import { BasePage } from "./BasePage";
import { Header } from "./HeaderComponent";
import { ProductPage } from "./ProductPage";

export class HomePage extends BasePage{
    readonly header = new Header();
    
    clickFirstProduct(): ProductPage {
        cy.get('[data-test="product-name"]').first().click();

        return new ProductPage();
    }

    
}
