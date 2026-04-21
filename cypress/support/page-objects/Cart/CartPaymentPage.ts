import { faker } from "@faker-js/faker";
import { PaymentMethod } from "../../types/payment-methods";
import { CartBasePage } from "./CartBaseBage";

export class CartPaymentPage extends CartBasePage {

    private readonly confirmButtonTestId = 'finish';

    private readonly openPaymentMethodsDropdownTestId = 'payment-method';
     
    private readonly bankNameTestId = 'bank_name';
    private readonly accountNameTestId = 'account_name';
    private readonly accountNumberTestId = 'account_number';

    private readonly creditCardNumberTestId = 'credit_card_number';
    private readonly creditCardExpiryTestId = 'expiration_date';
    private readonly creditCardCvvTestId = 'cvv';
    private readonly creditCardHolderNameTestId = 'card_holder_name';

    private readonly paymentSuccessMessageTestId = 'payment-success-message';

    private readonly orderConfirmationMessageId = 'order-confirmation';

    selectPaymentMethod(paymentMethod: PaymentMethod) {

        cy.findByTestId(this.openPaymentMethodsDropdownTestId).select(paymentMethod);
    }

    selectBankTransferAndEnterBankDetails(accountName?: string, accountNumber?: string, bankName?: string): CartPaymentPage {
        const name = !accountName ? accountName = faker.finance.accountName() : accountName;
        const number =  !accountNumber ?accountNumber = faker.finance.accountNumber(10) : accountNumber;
        const bank = !bankName ? bankName = `${faker.company.name().replaceAll(/[-,'`.<>]/g, '')} Bank` : bankName;
        
        this.selectPaymentMethod(PaymentMethod.bankTransfer);

        cy.findByTestId(this.bankNameTestId).type(bank);
        cy.findByTestId(this.accountNameTestId).type(name);
        cy.findByTestId(this.accountNumberTestId).type(number);
        
        return this;
    }

    selectCashOnDelivery(): CartPaymentPage {
        this.selectPaymentMethod(PaymentMethod.cashOnDelivery);
        return this;
    }

    selectCreditCardAndEnterDetails(creditCardNumber?: string, creditCardExpiry?: string, creditCardCvv?: string, creditCardHolderName?: string): CartPaymentPage {
        if (!creditCardNumber || !creditCardExpiry || !creditCardCvv || !creditCardHolderName) {
            creditCardNumber = faker.finance.creditCardNumber();
            creditCardExpiry = faker.date.future().toISOString().split('T')[0];
            creditCardCvv = faker.finance.accountNumber(3);
            creditCardHolderName = faker.person.fullName();
        }

        this.selectPaymentMethod(PaymentMethod.creditCard);

        cy.findByTestId(this.creditCardNumberTestId).type(creditCardNumber);
        cy.findByTestId(this.creditCardExpiryTestId).type(creditCardExpiry);
        cy.findByTestId(this.creditCardCvvTestId).type(creditCardCvv);
        cy.findByTestId(this.creditCardHolderNameTestId).type(creditCardHolderName);

        return this;
    }

    // TODO: Implement s=installments selection
    selectBuyNowPayLater(): CartPaymentPage {
        this.selectPaymentMethod(PaymentMethod.buyNoPayLater);

        return this;
    }

    // TODO: Implement gift card detsild input
    selectGiftCard(): CartPaymentPage {
        this.selectPaymentMethod(PaymentMethod.giftCard);

        return this;
    }

    clickConfirm(): CartPaymentPage {
        cy.findByTestId(this.confirmButtonTestId).click();

        return this;
    }

    getPaymentSuccessMessage(): Cypress.Chainable<JQuery<HTMLElement>> {

        return cy.findByTestId(this.paymentSuccessMessageTestId, {timeout: 10000});
    }

    getOrderConfirmationMessage(): Cypress.Chainable<JQuery<HTMLElement>> {

        return cy.get(`#${this.orderConfirmationMessageId}`, {timeout: 10000});
    }   
}