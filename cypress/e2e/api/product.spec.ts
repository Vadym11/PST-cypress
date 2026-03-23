import { ApiProduct } from "../../support/api-models/product-api";
import { ApiUser } from "../../support/api-models/user-api";
import { Product, ProductRequest } from "../../support/types/product";
import { generateRandomProductDataFaker } from "../../support/utils/test-utils";
import { faker } from "@faker-js/faker";

describe('Product API Tests', () => {
    const apiProduct: ApiProduct = new ApiProduct();
    const apiUser: ApiUser = new ApiUser();
    let currentProduct: Product;
    let adminToken: string;
    let createdProductId: string;
    let createdProductData: ProductRequest;

    before(() => {
        return apiProduct.getAllProducts().then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.data).to.be.an('array').and.not.to.be.empty;
            currentProduct = faker.helpers.arrayElement(res.body.data);
            return cy.getAdminCreds();
        }).then(({ email, password }) => {
            return apiUser.loginUser(email, password);
        }).then((res) => {
            expect(res.status).to.eq(200);
            adminToken = res.body.access_token;
        });
    });

    it('should get all products', () => {
        apiProduct.getAllProducts().then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.data).to.be.an('array');
            expect(res.body).to.have.property('current_page');
            expect(res.body).to.have.property('total');
        });
    });

    it('should get product info by id', () => {
        apiProduct.getById(currentProduct.id).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.include({
                id: currentProduct.id,
                name: currentProduct.name,
            });
        });
    });

    it('should search products by name query', () => {
        apiProduct.search(currentProduct.name).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.data).to.be.an('array').and.not.to.be.empty;
            expect(res.body.data.some((product) => product.name === currentProduct.name)).to.eq(true);
        });
    });

    it('should get related products by id', () => {
        apiProduct.getRelated(currentProduct.id).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.be.an('array');
            res.body.forEach((product) => {
                expect(product).to.have.property('id');
                expect(product).to.have.property('name');
            });
        });
    });

    it('should filter products by brand', () => {
        apiProduct.getAllProducts({ by_brand: currentProduct.brand.id }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.data).to.be.an('array');
            expect(res.body.data.length).to.be.greaterThan(0);
            res.body.data.forEach((product) => {
                expect(product.brand.id).to.eq(currentProduct.brand.id);
            });
        });
    });

    it('should filter products by category', () => {
        apiProduct.getAllProducts({ by_category: currentProduct.category.id }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.data).to.be.an('array');
            expect(res.body.data.length).to.be.greaterThan(0);
            res.body.data.forEach((product) => {
                expect(product.category.id).to.eq(currentProduct.category.id);
            });
        });
    });

    it('should sort products by price descending', () => {
        apiProduct.getAllProducts({ sort: 'price,desc' }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.data).to.be.an('array').and.not.to.be.empty;
            const prices = res.body.data.map((product) => product.price);
            const sorted = [...prices].sort((a, b) => b - a);
            expect(prices).to.deep.equal(sorted);
        });
    });

    it('should return 404 for unknown product id', () => {
        apiProduct.getById('9999999999999', false).then((res) => {
            expect(res.status).to.eq(404);
            expect(res.body).to.have.property('message');
        });
    });

    it('should create product', () => {
        createdProductData = generateRandomProductDataFaker({
            categoryId: currentProduct.category.id,
            brandId: currentProduct.brand.id,
            productImageId: currentProduct.product_image.id,
        });

        apiProduct.createProduct(createdProductData, adminToken).then((res) => {
            expect(res.status).to.eq(201);
            expect(res.body).to.include({
                name: createdProductData.name,
                description: createdProductData.description,
                co2_rating: createdProductData.co2_rating,
            });
            expect(res.body.price).to.eq(createdProductData.price);
            createdProductId = res.body.id;
        });
    });

    it('should update product', () => {
        expect(createdProductId, 'created product id').to.be.a('string').and.not.be.empty;

        const updatedProductData: ProductRequest = {
            ...createdProductData,
            name: `${faker.commerce.productAdjective()} Updated Tool ${Date.now()}`,
            description: faker.commerce.productDescription().substring(0, 220),
            price: Number(faker.commerce.price({ min: 50, max: 900, dec: 2 })),
            is_rental: !createdProductData.is_rental,
            is_location_offer: !createdProductData.is_location_offer,
            co2_rating: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
        };

        apiProduct.updateProduct(createdProductId, updatedProductData, adminToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('success', true);
            return apiProduct.getById(createdProductId);
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.include({
                id: createdProductId,
                name: updatedProductData.name,
                description: updatedProductData.description,
                co2_rating: updatedProductData.co2_rating,
            });
            expect(res.body.price).to.eq(updatedProductData.price);
            createdProductData = updatedProductData;
        });
    });

    it('should partially update product', () => {
        expect(createdProductId, 'created product id').to.be.a('string').and.not.be.empty;
        const patchedName = `${faker.commerce.productMaterial()} Patched Tool ${Date.now()}`;

        apiProduct.partiallyUpdateProduct(createdProductId, { name: patchedName }, adminToken).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('success', true);
            return apiProduct.getById(createdProductId);
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.include({
                id: createdProductId,
                name: patchedName,
            });
            createdProductData.name = patchedName;
        });
    });

    it('should delete product', () => {
        expect(createdProductId, 'created product id').to.be.a('string').and.not.be.empty;

        apiProduct.deleteProduct(createdProductId, adminToken).then((res) => {
            expect(res.status).to.eq(204);
            return apiProduct.getById(createdProductId, false);
        }).then((res) => {
            expect(res.status).to.eq(404);
            expect(res.body).to.have.property('message', 'Requested item not found');
        });
    });
});
