import { ApiUser } from "../../support/api-models/user-api";
import { HomePage } from "../../support/page-objects/HomePage";
import { CreateUser } from "../../support/types/user";
import { generateRandomUserDataFaker } from "../../support/utils/test-utils";

describe('Product purchase flow', () => {

    let user: CreateUser;
    let guestUser: CreateUser;
    const homePage = new HomePage();
    const currentYear = new Date().getFullYear();

    before(() => {
        user = generateRandomUserDataFaker();
        guestUser = generateRandomUserDataFaker();

        const userAPI = new ApiUser();

        userAPI.registerUser(user).then((res) => {
            expect(res.status).to.equal(201);
            expect(res.body).to.include({
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            });
        });
    });

    it('should allow a user to purchase a product as a guest', () => {
        const cartPaymentPage =  homePage
            .goToHomePage()
            .clickFirstProduct()
            .clickAddToCartAndAssertPopUps(3)
            .goToCart()
            .clickProceedToCheckout()
            .switchToContinueAsGuest()
            .fillGuestEmail(guestUser.email)
            .fillGuestFirstName(guestUser.first_name)
            .fillGuestLastName(guestUser.last_name)
            .clickContinueAsGuest()
            .clickProceedToBillingAsGuest()
            .fillBillingAddress(guestUser)
            .clickProceedToPayment()
            .selectCashOnDelivery()
            .clickConfirm();

        cartPaymentPage.getPaymentSuccessMessage()
            .should('have.text', 'Payment was successful');

        cartPaymentPage.clickConfirm();

        cartPaymentPage.getOrderConfirmationMessage()
            .should('contain.text', 
                    `Thanks for your order! Your invoice number is INV-${currentYear}`);
    });

    it('should allow a user to purchase a product as a registered user (signed out)', () => {
        const cartPaymentPage =  homePage
            .goToHomePage()
            .clickFirstProduct()
            .clickAddToCartAndAssertPopUps()
            .goToCart()
            .clickProceedToCheckout()
            .login(user.email, user.password)
            .clickProceedToBilling()
            .clickProceedToPayment()
            .selectCashOnDelivery()
            .clickConfirm();

        cartPaymentPage.getPaymentSuccessMessage()
            .should('have.text', 'Payment was successful');

        cartPaymentPage.clickConfirm();

        cartPaymentPage.getOrderConfirmationMessage()
            .should('contain.text', 
                    `Thanks for your order! Your invoice number is INV-${currentYear}`);
    });

    it('should allow a user to purchase a product as a registered user (signed in)', () => {
        const cartPaymentPage = homePage
            .goToHomePage().header
            .clickSignIn()
            .login(user.email, user.password)
            .goToHomePage()
            .clickFirstProduct()
            .clickAddToCartAndAssertPopUps()
            .goToCart()
            .clickProceedToCheckout()
            .clickProceedToBilling()
            .clickProceedToPayment()
            .selectBankTransferAndEnterBankDetails()
            .clickConfirm();

        cartPaymentPage.getPaymentSuccessMessage()
            .should('have.text', 'Payment was successful');

        cartPaymentPage.clickConfirm();

        cartPaymentPage.getOrderConfirmationMessage()
            .should('contain.text', 
                `Thanks for your order! Your invoice number is INV-${currentYear}`);
    });
});