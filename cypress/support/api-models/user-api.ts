import { ApiHandler } from "../utils/api-handler";
import { CreateUser, GetAllUsersResponse } from "../types/user";
import { urls } from "../utils/project-utils";
import { LoginResponse, LogOutResponse, PaginatedResponse, SuccessResponse } from "../types/common-responses-api";

export class ApiUser {

    private readonly apiUrl: string;
    private readonly apiHandler: ApiHandler;

    constructor() {
        this.apiUrl = urls.apiUrl;
        this.apiHandler = new ApiHandler();
    }

    getAllUsers(token: string): Cypress.Chainable<Cypress.Response<PaginatedResponse<GetAllUsersResponse>>> {
        return this.apiHandler.get(
            '/users',
            token,
        );
    }

    registerUser(userData: CreateUser, token?: string): Cypress.Chainable<Cypress.Response<GetAllUsersResponse>> {
        return this.apiHandler.post(
          '/users/register',
            userData,
            token
        );
    }

    loginUser(email: string, password: string): Cypress.Chainable<Cypress.Response<LoginResponse>> {
        return this.apiHandler.post(
            '/users/login',
            { email, password }
        );
    }

    forgotPassword(email: string): Cypress.Chainable<Cypress.Response<SuccessResponse>> {
        return this.apiHandler.post(
            '/users/forgot-password',
            { email }
        );
    }

    changePassword(curentPassword: string, newPassword: string, token: string): Cypress.Chainable<Cypress.Response<SuccessResponse>> {
        return this.apiHandler.post(
            '/users/change-password',
            { current_password: curentPassword, new_password: newPassword, new_password_confirmation: newPassword },
            token
        );
    }

    getCurrentUser(token: string): Cypress.Chainable<Cypress.Response<GetAllUsersResponse>> {
        return this.apiHandler.get(
            '/users/me',
            token
        );
    }

    logoutUser(token: string): Cypress.Chainable<Cypress.Response<LogOutResponse>> {
        return this.apiHandler.get(
            '/users/logout',
            token
        );
    }

    refreshToken(token: string): Cypress.Chainable<Cypress.Response<LoginResponse>> {
        return this.apiHandler.get(
            '/users/refresh',
            token
        );
    }

    getById(userId: string, token: string, failOnStatus: boolean = true): Cypress.Chainable<Cypress.Response<GetAllUsersResponse>> {
        return this.apiHandler.get(
            `/users/${userId}`,
            token,
            failOnStatus
        );
    }

    partiallyUpdateInfo(userId: string, updatedData: Partial<CreateUser>, token: string): Cypress.Chainable<Cypress.Response<SuccessResponse>> {
        return this.apiHandler.patch(
            `/users/${userId}`,
            updatedData,
            token
        );
    }

    updateInfo(userId: string, updatedData: CreateUser, token: string): Cypress.Chainable<Cypress.Response<SuccessResponse>> {
        return this.apiHandler.update(
            `/users/${userId}`,
            updatedData,
            token
        );
    }

    search(query: string, token: string, pageNumber?: number): Cypress.Chainable<Cypress.Response<PaginatedResponse<GetAllUsersResponse>>> {
        return this.apiHandler.get(
            `/users/search?query=${query}&page=${pageNumber || 1}`,
            token
        );
    }

    deleteUser(userId: string, token: string): Cypress.Chainable<Cypress.Response<number>> {
        return this.apiHandler.delete(
            `/users/${userId}`,
            token
        );
    }
}