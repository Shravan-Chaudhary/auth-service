import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { User } from "../entity/User";
import { Logger } from "winston";
import createHttpError from "http-errors";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;

    if (!email) {
      const error = createHttpError(400, "Email is required");
      next(error);
    }

    this.logger.debug("New Request to register a user", { firstName, lastName, email, password: "****" });

    try {
      const user: User = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });
      this.logger.info("User registered", { id: user.id });
      res.status(201).json({ id: user.id });
    } catch (err) {
      next(err);
      return;
    }
  }
}
