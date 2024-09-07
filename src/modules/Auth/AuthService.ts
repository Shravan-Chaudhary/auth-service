import { User } from "../../entity/User";
import { IUserData } from "../../types";
import { Repository } from "typeorm";
import { UserService } from "../Users/UserService";
import createHttpError from "http-errors";
import { CredentialsService } from "../Credentials/CredentialsService";
import CreateHttpError from "../../common/errors/http-exceptions";

export interface IAuthService {
    register(userData: IUserData): Promise<User>;
    validate(email: string, password: string): Promise<User>;
    logout(userId: number): Promise<User>;
}

export class AuthService implements IAuthService {
    userRepository: Repository<User>;
    credentialService: CredentialsService;
    userService: UserService;
    constructor(
        userService: UserService,
        credentialService: CredentialsService,
        userRepository: Repository<User>,
    ) {
        this.userService = userService;
        this.credentialService = credentialService;
        this.userRepository = userRepository;
    }
    public async register(userData: IUserData): Promise<User> {
        try {
            const registeredUser = await this.userService.create(userData);
            return registeredUser;
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                throw error;
            }
            throw CreateHttpError.BadRequestError();
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
            throw CreateHttpError.UnauthorizedError(
                "email or password does not match",
            );
        }
    }
    public async logout(userId: number): Promise<User> {
        throw new Error("Method not implemented." + userId);
    }
}
