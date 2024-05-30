/* eslint-disable @typescript-eslint/no-unused-vars */
import createHttpError from "http-errors";
import AppDataSource from "../config/data-source";
import { User } from "../entity/User";
import { UserData } from "../types";
import { Repository } from "typeorm";

export interface IUserService {
    create(userData: UserData): Promise<User>;
    findByEmailWithPassword(email: string): Promise<User>;
    findById(userId: number): Promise<User>;
    getAll(): Promise<User[]>;
    update(userId: number): Promise<User>;
    delete(userId: number): void;
}

export class UserService implements IUserService {
    userRepository: Repository<User>;
    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    public async create({
        firstName,
        lastName,
        email,
        password,
    }: UserData): Promise<User> {
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
            });
        } catch (error) {
            const err = createHttpError(500, "error while creating user");
            throw err;
        }
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
