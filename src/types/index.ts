import { Request } from "express";

// Input types
export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}

export interface TenantData {
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
    body: UserData;
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
        id?: string;
    };
}

export interface TenantReqeust extends Request {
    body: TenantData;
}
