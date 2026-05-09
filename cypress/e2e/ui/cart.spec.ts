import { ApiUser } from '../../support/api-models/user-api';
import { HomePage } from '../../support/page-objects/HomePage';
import { CreateUser } from '../../support/types/user';
import { generateRandomUserDataFaker } from '../../support/utils/test-utils';

describe('Cart', () => {
    let user: CreateUser;
    let userId: string;
    const homePage = new HomePage();
    const apiUser = new ApiUser();

    before(() => {
        user = generateRandomUserDataFaker();
        apiUser.registerUser(user).then(res => {
            expect(res.status).to.equal(201);
            userId = res.body.id;
        });
    });

    after(() => {
        if (!userId) {
            cy.log('No userId to clean up — skipping');
            return;
        }
        cy.env(['adminEmail', 'adminPassword']).then(({ adminEmail, adminPassword }) => {
            apiUser.loginUser(adminEmail, adminPassword).then(res => {
                apiUser.deleteUser(userId, res.body.access_token);
            });
        });
    });

    beforeEach(() => {
        cy.loginViaApi(user.email, user.password);
    });

    it('TC-CART-001: should add a product to the cart as a logged-in customer', () => {
        const productPage = homePage.goTo().selectRandomProduct();
        productPage.clickAddToCart();
        productPage.getAddedToCartPopUp().last().should('be.visible');
    });

    it('TC-CART-002: should display added products on the cart page', () => {
        const cartMainPage = homePage.goTo().selectRandomProduct().clickAddToCartAndAssertPopUps(1).goToCart();
        cartMainPage.getProductTitles().should('have.length.at.least', 1);
    });

    it('TC-CART-003: should update the product quantity and recalculate the cart total', () => {
        const updatedQuantity = 3;
        const cartMainPage = homePage.goTo()
            .selectRandomProduct()
            .clickAddToCartAndAssertPopUps(1)
            .goToCart();

        cartMainPage.getCartTotal().invoke('text').then(initialTotal => {
            cartMainPage.updateProductQuantityByIndex(0, updatedQuantity);
            cartMainPage.getProductQuantityInputByIndex(0).should('have.value', String(updatedQuantity));
            cartMainPage.getCartTotal().invoke('text').should('not.equal', initialTotal);
        });
    });

    it('TC-CART-004: should remove a product from the cart', () => {
        const cartMainPage = homePage.goTo().selectRandomProduct().clickAddToCartAndAssertPopUps(1).goToCart();
        cartMainPage.getProductTitles().should('have.length.at.least', 1);
        cartMainPage.removeProductByIndex(0);
        cartMainPage.getProductTitles().should('not.exist');
    });

    it('TC-CART-005: should retain cart items after logging out and logging back in', () => {
        let savedProductName: string;
        const cartMainPage = homePage.goTo().selectRandomProduct().clickAddToCartAndAssertPopUps(1).goToCart();

        cartMainPage.getProductTitles().first().invoke('text').then(name => {
            savedProductName = name.trim();
        });

        // Simulate session end
        cy.clearLocalStorage();
        cy.visit('/');

        // Re-authenticate directly to avoid cy.session cache restoring stale state
        cy.request('POST', 'api/users/login', { email: user.email, password: user.password })
            .then(({ body }) => cy.window().then(win => win.localStorage.setItem('auth-token', body.access_token)));

        cartMainPage.header.clickCart();
        cartMainPage.getProductTitles().first().invoke('text').then(name => {
            expect(name.trim()).to.equal(savedProductName);
        });
    });

    it('TC-CART-006: should show an error when quantity exceeds available stock', () => {
        const cartMainPage = homePage.goTo().selectRandomProduct().clickAddToCartAndAssertPopUps(1).goToCart();
        cartMainPage.updateProductQuantityByIndex(0, 200);
        cartMainPage.getQuantityErrorMessage().should('be.visible');
    });

    it('TC-CART-007: should prompt an anonymous user to sign in when proceeding to checkout', () => {
        cy.clearLocalStorage('auth-token');
        const cartSignInPage = homePage
            .goTo()
            .selectRandomProduct()
            .clickAddToCartAndAssertPopUps(1)
            .goToCart()
            .clickProceedToCheckout();

        cartSignInPage.assertSignInPageVisible();
    });
});
