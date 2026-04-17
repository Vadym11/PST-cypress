import { urls } from "./project-utils"

export class ApiHandler {
    private apiUrl: string;

    constructor() {
        this.apiUrl = urls.apiUrl;
    }

    private buildHeaders(token?: string): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    }

    get<T>(endpoint: string, token?: string, failOnStatus: boolean = true): Cypress.Chainable<Cypress.Response<T>> {
        return cy.request<T>({
            method: 'GET',
            url: `${this.apiUrl}${endpoint}`,
            headers: this.buildHeaders(token),
            failOnStatusCode: failOnStatus
        });
    }

    post<T>(endpoint: string, body: any, token?: string, failOnStatus: boolean = true): Cypress.Chainable<Cypress.Response<T>> {
        return cy.request<T>({
            method: 'POST',
            url: `${this.apiUrl}${endpoint}`,
            body,
            headers: this.buildHeaders(token),
            failOnStatusCode: failOnStatus
        });
    }

    delete<T>(endpoint: string, token?: string, failOnStatus: boolean = true): Cypress.Chainable<Cypress.Response<T>> {
        return cy.request<T>({
            method: 'DELETE',
            url: `${this.apiUrl}${endpoint}`,
            headers: this.buildHeaders(token),
            failOnStatusCode: failOnStatus
        });
    }

    update<T>(endpoint: string, body: any, token?: string, failOnStatus: boolean = true): Cypress.Chainable<Cypress.Response<T>> {
        return cy.request<T>({
            method: 'PUT',
            url: `${this.apiUrl}${endpoint}`,
            body,
            headers: this.buildHeaders(token),
            failOnStatusCode: failOnStatus
        });
    }

    patch<T>(endpoint: string, body: any, token?: string, failOnStatus: boolean = true): Cypress.Chainable<Cypress.Response<T>> {
        return cy.request<T>({
            method: 'PATCH',
            url: `${this.apiUrl}${endpoint}`,
            body,
            headers: this.buildHeaders(token),
            failOnStatusCode: failOnStatus
        });
    }
}