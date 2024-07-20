import { Repository } from "typeorm";
import { User } from "../../entity/User";
import { UserData } from "../../types";
import {
    createConflictError,
    createDatabaseError,
    createUnauthorizedError,
} from "../../common/errors/http-exceptions";
import { CredentialService } from "../Credentials/CredentialService";

interface IUserService {
    create({ firstName, lastName, email, password }: UserData): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    findAll(): Promise<User[]>;
}

export class UserService implements IUserService {
    credentialService: CredentialService;
    userRepository: Repository<User>;
    constructor(
        credentialService: CredentialService,
        userRepository: Repository<User>,
    ) {
        this.credentialService = credentialService;
        this.userRepository = userRepository;
    }

    public async create({
        firstName,
        lastName,
        email,
        password,
        role,
    }: UserData): Promise<User> {
        const userExists = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (userExists) {
            throw createConflictError("user already exists");
        }

        const hashedPassword =
            await this.credentialService.hashPassword(password);

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: role,
            });
        } catch (error) {
            throw createDatabaseError("error while saving user in database");
        }
    }
    public async findOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw createUnauthorizedError("email or password does not match");
        }

        return user;
    }
    findAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
}
