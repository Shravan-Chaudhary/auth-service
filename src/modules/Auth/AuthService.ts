/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from "../../entity/User";
import { UserData } from "../../types";
import { Repository } from "typeorm";
import { UserService } from "../User/UserService";
import createHttpError from "http-errors";
import { createBadRequestError } from "../../common/errors/http-exceptions";

export interface IAuthService {
    register(userData: UserData): Promise<User>;
    login(email: string): Promise<User>;
    logout(userId: number): Promise<User>;
}

export class AuthService implements IAuthService {
    userRepository: Repository<User>;
    userService: UserService;
    constructor(userService: UserService, userRepository: Repository<User>) {
        this.userService = userService;
        this.userRepository = userRepository;
    }
    public async register(userData: UserData): Promise<User> {
        try {
            const registeredUser = await this.userService.create(userData);
            return registeredUser;
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                throw error;
            }
            throw createBadRequestError();
        }
    }
    public async login(email: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    public async logout(userId: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
}
