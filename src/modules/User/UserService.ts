import { Repository } from "typeorm";
import { User } from "../../entity/User";
import bcrypt from "bcryptjs";
import { UserData } from "../../types";
import {
    createConflictError,
    createDatabaseError,
} from "../../common/errors/http-exceptions";

interface IUserService {
    create({ firstName, lastName, email, password }: UserData): Promise<User>;
    findOne(): Promise<User>;
    findAll(): Promise<User[]>;
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
        const userExists = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (userExists) {
            throw createConflictError("user already exists");
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
            throw createDatabaseError("error while creating user");
        }
    }
    findOne(): Promise<User> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
}
