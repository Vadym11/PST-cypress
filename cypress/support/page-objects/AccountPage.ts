import { BasePage } from "./BasePage";
import { Header } from "./HeaderComponent";
export class AccountPage extends BasePage {

    private readonly navButtonsSelector = '.btn-group-vertical > a';
    private readonly titleSelector = 'h1';
    private readonly infoMessageSelector = 'h1 + p';
    readonly header: Header;
    
    constructor() {
        super();
        this.header = new Header();
    }

    private navButtons() {
        return cy.get(this.navButtonsSelector);
    }

    goToFavorites(): AccountPage {
        cy.findByTestId('nav-favorites').click();
        return this;
    }

    goToProfile(): AccountPage {
        cy.findByTestId('nav-profile').click();
        return this;
    }

    goToInvoices(): AccountPage {
        cy.findByTestId('nav-invoices').click();
        return this;
    }

    goToMessages(): AccountPage {
        cy.findByTestId('nav-messages').click();
        return this;
    }

    /**
     * Verifies the page title.
     * @param expectedTitle 
     * @returns 
     */
    verifyPageTitle(expectedTitle: string): AccountPage {
        cy.get(this.titleSelector).should('have.text', expectedTitle);
        return this;
    }

    /**
     * Verifies that the navigation buttons contain the expected texts.
     * @param expectedTexts 
     */
    verifyNavButtonText(expectedTexts: string[]): AccountPage {
        this.navButtons().should(($els) => {
            expect($els).to.have.length(expectedTexts.length);
            $els.each((index, el) => {
                expect(el).to.contain.text(expectedTexts[index]);
            });
        });
        return this;
    }

    /**
     * Verifies Account page info message.
     * @param expectedMessage 
     * @returns 
     */
    verifyInfoMessage(expectedMessage: string): AccountPage {
        cy.get(this.infoMessageSelector).should('have.text', expectedMessage);

        return this;
    }

    /**
     * Verifies entire Account page.
     * @param title 
     * @param infoMessage 
     * @param navButtonsTexts 
     */
    verifyAccountPage(title: string, infoMessage: string, navButtonsTexts: string[]): AccountPage {
        return this
            .verifyPageTitle(title)
            .verifyNavButtonText(navButtonsTexts)
            .verifyInfoMessage(infoMessage);
    }
}