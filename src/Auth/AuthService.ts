/* eslint-disable @typescript-eslint/no-unused-vars */
import createHttpError from "http-errors";
import { User } from "../entity/User";
import { UserData } from "../types";
import { Repository } from "typeorm";
import bcrypt from "bcryptjs";

export interface IAuthService {
    create(userData: UserData): Promise<User>;
    findByEmailWithPassword(email: string): Promise<User>;
    findById(userId: number): Promise<User>;
}

export class AuthService implements IAuthService {
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
        const userExists = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (userExists) {
            const err = createHttpError(409, "user already exists");
            throw err;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: "customer",
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
}
