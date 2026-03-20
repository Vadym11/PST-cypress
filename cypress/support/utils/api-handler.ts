import { urls } from "./project-utils"

export class ApiHandler {
    private apiUrl: string;

    constructor() {
        this.apiUrl = urls.apiUrl;
    }

    get<T>(endpoint: string, token?: string): Cypress.Chainable<Cypress.Response<T>> {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return cy.request<T>({
            method: 'GET',
            url: `${this.apiUrl}${endpoint}`,
            headers,
        });
    }

    post<T>(endpoint: string, body: any, token?: string): Cypress.Chainable<Cypress.Response<T>> {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return cy.request<T>({
            method: 'POST',
            url: `${this.apiUrl}${endpoint}`,
            body,
            headers,
        });
    }

    delete<T>(endpoint: string, token?: string): Cypress.Chainable<Cypress.Response<T>> {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return cy.request<T>({
            method: 'DELETE',
            url: `${this.apiUrl}${endpoint}`,
            headers,
        });
    }

    update<T>(endpoint: string, body: any, token?: string): Cypress.Chainable<Cypress.Response<T>> {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return cy.request<T>({
            method: 'PUT',
            url: `${this.apiUrl}${endpoint}`,
            body,
            headers,
        });
    }

    patch<T>(endpoint: string, body: any, token?: string): Cypress.Chainable<Cypress.Response<T>> {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return cy.request<T>({
            method: 'PATCH',
            url: `${this.apiUrl}${endpoint}`,
            body,
            headers,
        });
    }
}