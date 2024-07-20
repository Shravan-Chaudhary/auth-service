import { User } from "../../entity/User";
import { UserData } from "../../types";
import { Repository } from "typeorm";
import { UserService } from "../User/UserService";
import createHttpError from "http-errors";
import {
    createBadRequestError,
    createUnauthorizedError,
} from "../../common/errors/http-exceptions";
import { CredentialService } from "../Credentials/CredentialService";

export interface IAuthService {
    register(userData: UserData): Promise<User>;
    validate(email: string, password: string): Promise<User>;
    logout(userId: number): Promise<User>;
}

export class AuthService implements IAuthService {
    userRepository: Repository<User>;
    credentialService: CredentialService;
    userService: UserService;
    constructor(
        userService: UserService,
        credentialService: CredentialService,
        userRepository: Repository<User>,
    ) {
        this.userService = userService;
        this.credentialService = credentialService;
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
    public async validate(email: string, password: string): Promise<User> {
        try {
            const user = await this.userService.findOneByEmail(email);

            await this.credentialService.comparePassword(
                password,
                user.password,
            );

            return user;
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                throw error;
            }
            throw createUnauthorizedError("email or password does not match");
        }
    }
    public async logout(userId: number): Promise<User> {
        throw new Error("Method not implemented." + userId);
    }
}
