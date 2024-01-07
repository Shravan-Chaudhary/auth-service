import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { User } from "../entity/User";
import { LimitedUserData, UserData } from "../types";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password, role }: UserData): Promise<User> {
    // Check if user already exists
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      const error = createHttpError(409, "User already exists with this email");
      throw error;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Store user in database
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });
    } catch (err) {
      const error = createHttpError(500, "Failed to store user in database");
      throw error;
    }
  }

  async findByEmail(email: string) {
    // find user
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async findById(userId: number) {
    // find user by id
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async getAll(): Promise<User[]> {
    // get all users
    return await this.userRepository.find();
  }

  async update(userId: number, { firstName, lastName, role }: LimitedUserData) {
    try {
      // update user
      await this.userRepository.update(userId, { firstName, lastName, role });

      // return updated user
      return await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
    } catch (err) {
      const error = createHttpError(500, "Failed to update user from database");
      throw error;
    }
  }
}
