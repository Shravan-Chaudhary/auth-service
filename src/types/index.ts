import { Request } from "express";

// Input types
export interface IUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    tenantId?: number;
}

export interface IUpdateUserData {
    firstName: string;
    lastName: string;
    role: string;
}

export interface ITenantData {
    name: string;
    address: string;
}

// Cookies types
export type AuthCookie = {
    accessToken: string;
    refreshToken: string;
};

// Token types
export interface IRefreshTokenPayload {
    id: string;
}

// Request types
export interface RegisterUserRequest extends Request {
    body: IUserData;
}

export interface LoginUserRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string; // for refresh token only (it's record id from db)
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface CreateUserRequest extends Request {
    body: IUserData;
}

export interface UpdateUserRequest extends Request {
    body: IUpdateUserData;
}

export interface CreateTenantRequest extends Request {
    body: ITenantData;
}

export interface UpdateTenantRequest extends Request {
    body: ITenantData;
}
