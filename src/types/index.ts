import { Request } from "express";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  tenantId?: number;
}

export interface LimitedUserData {
  firstName: string;
  lastName: string;
  role: string;
}

export interface TenantData {
  name: string;
  address: string;
}

export interface RegisterUserRequest extends Request {
  body: UserData;
}

export interface CreateTenantRequest extends Request {
  body: TenantData;
}

export interface CreateUserRequest extends Request {
  body: UserData;
}

export interface LoginUserRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface UpdateUserRequest extends Request {
  body: LimitedUserData;
}

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
    id?: string;
  };
}

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
};

export interface IRefreshTokenPayload {
  id: string;
}
