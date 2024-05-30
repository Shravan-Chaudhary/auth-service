/* eslint-disable @typescript-eslint/no-unused-vars */
import AppDataSource from "../config/data-source";
import { User } from "../entity/User";
import { UserData } from "../types";

export interface IUserService {
    create(userData: UserData): Promise<User>;
    findByEmailWithPassword(email: string): Promise<User>;
    findById(userId: number): Promise<User>;
    getAll(): Promise<User[]>;
    update(userId: number): Promise<User>;
    delete(userId: number): void;
}

export class UserService implements IUserService {
    constructor() {}

    public async create(userData: UserData): Promise<User> {
        const { firstName, lastName, email, password } = userData;
        const userRepository = AppDataSource.getRepository(User);

        return await userRepository.save({
            firstName,
            lastName,
            email,
            password,
        });
    }

    findByEmailWithPassword(email: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    findById(userId: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    update(userId: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
    delete(userId: number): void {
        throw new Error("Method not implemented.");
    }
}
