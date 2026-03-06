export class AccountPage {

    private get navButtons() {
        return cy.get('.btn-group-vertical > a');
    }

    goToFavorites(): void {
        cy.findByTestId('nav-favorites').click();
    }

    goToProfile(): void {
        cy.findByTestId('nav-profile').click();
    }

    goToInvoices(): void {
        cy.findByTestId('nav-invoices').click();
    }

    goToMessages(): void {
        cy.findByTestId('nav-messages').click();
    }

    /**
     * Verifies the page title.
     * @param expectedTitle 
     * @returns 
     */
    verifyPageTitle(expectedTitle: string): AccountPage {
        cy.get('h1').should('have.text', expectedTitle);
        return this;
    }

    /**
     * Verifies that the navigation buttons contain the expected texts.
     * @param expectedTexts 
     */
    verifyNavButtonText(expectedTexts: string[]): AccountPage {
        this.navButtons.each(($el, index) => {
            cy.wrap($el).should('contain.text', expectedTexts[index]);
        });

        return this;
    }

    /**
     * Verifies Account page info message.
     * @param expectedMessage 
     * @returns 
     */
    verifyInfoMessage(expectedMessage: string): AccountPage {
        cy.get('h1').next('p').should('have.text', expectedMessage);

        return this;
    }

    /**
     * Verifies entire Account page.
     * @param title 
     * @param infoMessage 
     * @param navButtonsTexts 
     */
    verifyAccountPage(title: string, infoMessage: string, navButtonsTexts: string[]): void {
        this.verifyPageTitle(title)
            .verifyNavButtonText(navButtonsTexts)
            .verifyInfoMessage(infoMessage);
    }
}