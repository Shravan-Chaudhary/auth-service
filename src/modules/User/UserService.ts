import { Repository } from "typeorm";
import { User } from "../../entity/User";
import bcrypt from "bcryptjs";
import { UserData } from "../../types";
import {
    conflictError,
    creationError,
} from "../../common/errors/custom-errors";

interface IUserService {}

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
            throw conflictError("user already exists");
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
            throw creationError("error while creating user");
        }
    }
}
