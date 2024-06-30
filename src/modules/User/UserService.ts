import { Repository } from "typeorm";
import { User } from "../../entity/User";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { UserData } from "../../types";

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
}
