import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { User } from "../../entity/User";
import { IUpdateUserData, IUserData } from "../../types";
import { CredentialsService } from "../Credentials/CredentialsService";
import CreateHttpError from "../../common/errors/http-exceptions";
import { Tenant } from "../../entity/Tenant";
import { Logger } from "winston";

export interface IUserService {
    create({ firstName, lastName, email, password }: IUserData): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    findOneById(id: number): Promise<User>;
    findAll(): Promise<User[]>;
    update(id: number, userData: IUpdateUserData): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}

export class UserService {
    constructor(
        private credentialService: CredentialsService,
        private userRepository: Repository<User>,
        private logger: Logger,
    ) {}
    public async create(
        { firstName, lastName, email, password, role }: IUserData,
        tenant?: Tenant,
    ) {
        const userExists = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (userExists) {
            throw CreateHttpError.ConflictError(
                "User already exists with this email",
            );
        }

        const hashedPassword =
            await this.credentialService.hashPassword(password);

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                tenant,
            });
        } catch (error) {
            throw CreateHttpError.DatabaseError(
                "error while saving user in database",
            );
        }
    }

    public async update(id: number, userData: IUpdateUserData) {
        try {
            const user = await this.userRepository.update(id, userData);
            if (!user.affected) {
                throw CreateHttpError.NotFoundError("user not found");
            }
            return user;
        } catch (error) {
            throw CreateHttpError.DatabaseError(
                "error while updating user in database",
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
            this.logger.debug(`User-Service: findOneByEmail: user not found`);
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

    public async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async delete(id: number) {
        return await this.userRepository.delete(id);
    }
}
