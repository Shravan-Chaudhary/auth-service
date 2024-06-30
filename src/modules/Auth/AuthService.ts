/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from "../../entity/User";
import { UserData } from "../../types";
import { Repository } from "typeorm";
import { UserService } from "../User/UserService";

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
    register(userData: UserData): Promise<User> {
        const registeredUser = this.userService.create(userData);
        return registeredUser;
    }
    login(email: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    logout(userId: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
}
