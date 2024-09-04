import { Repository } from "typeorm";
import { User } from "../../entity/User";
import { UserData } from "../../types";
import { CredentialsService } from "../Credentials/CredentialsService";
import CreateHttpError from "../../common/errors/http-exceptions";

export interface IUserService {
    create({ firstName, lastName, email, password }: UserData): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    findOneById(id: number): Promise<User>;
    findAll(): Promise<User[]>;
}

export class UsersService implements IUserService {
    credentialService: CredentialsService;
    userRepository: Repository<User>;
    constructor(
        credentialService: CredentialsService,
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
            throw CreateHttpError.ConflictError("user already exists");
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
            throw CreateHttpError.DatabaseError(
                "error while saving user in database",
            );
        }
    }
    public async findOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw CreateHttpError.UnauthorizedError(
                "email or password does not match",
            );
        }

        return user;
    }

    public async findOneById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!user) {
            throw CreateHttpError.NotFoundError("user not found");
        }

        return user;
    }

    findAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
}
