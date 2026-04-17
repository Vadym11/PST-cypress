import { PaginatedResponse, SuccessResponse } from "../types/common-responses-api";
import { Product, ProductQueryParams, ProductRequest } from "../types/product";
import { ApiHandler } from "../utils/api-handler";

export class ApiProduct {

    private readonly apiHandler: ApiHandler;

    constructor() {
        this.apiHandler = new ApiHandler();
    }

    getAllProducts(queryParams?: ProductQueryParams): Cypress.Chainable<Cypress.Response<PaginatedResponse<Product>>> {
        const query = queryParams ? this.getQueryParamsString(queryParams) : '';
        const endpoint = query ? `/products?${query}` : '/products';

        return this.apiHandler.get(
            endpoint,
        );
    }

    getById(productId: string, failOnStatus: boolean = true): Cypress.Chainable<Cypress.Response<Product>> {
        return this.apiHandler.get(
            `/products/${productId}`,
            undefined,
            failOnStatus
        );
    }

    search(query: string, page: number = 1): Cypress.Chainable<Cypress.Response<PaginatedResponse<Product>>> {
        return this.apiHandler.get(
            `/products/search?q=${encodeURIComponent(query)}&page=${page}`
        );
    }

    getRelated(productId: string): Cypress.Chainable<Cypress.Response<Product[]>> {
        return this.apiHandler.get(
            `/products/${productId}/related`
        );
    }

    createProduct(productData: ProductRequest, token?: string): Cypress.Chainable<Cypress.Response<Product>> {
        return this.apiHandler.post(
            '/products',
            productData,
            token
        );
    }

    updateProduct(productId: string, productData: ProductRequest, token?: string): Cypress.Chainable<Cypress.Response<SuccessResponse>> {
        return this.apiHandler.update(
            `/products/${productId}`,
            productData,
            token
        );
    }

    partiallyUpdateProduct(productId: string, productData: Partial<ProductRequest>, token?: string): Cypress.Chainable<Cypress.Response<SuccessResponse>> {
        return this.apiHandler.patch(
            `/products/${productId}`,
            productData,
            token
        );
    }

    deleteProduct(productId: string, token: string): Cypress.Chainable<Cypress.Response<void>> {
        return this.apiHandler.delete(
            `/products/${productId}`,
            token
        );
    }

    private getQueryParamsString(queryParams: ProductQueryParams): string {
        const params = new URLSearchParams();

        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, String(value));
            }
        });

        return params.toString();
    }
}
