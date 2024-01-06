import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { Roles } from "../constants";
import { CreateUserRequest } from "../types";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import createHttpError from "http-errors";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger
  ) {}

  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }

    const { firstName, lastName, email, password } = req.body;
    this.logger.debug("New Request to create a user by amdin", { firstName, lastName, email, password: "****" });
    // Create user using userService
    try {
      const user = await this.userService.create({ firstName, lastName, email, password, role: Roles.MANAGER });
      this.logger.info("User Created", { id: user.id });
      res.status(201).json({ id: user.id });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAll();
      if (!users) {
        const error = createHttpError(404, "No users found");
        next(error);
        return;
      }
      res.status(200).json(users);
    } catch (err) {
      const error = createHttpError(500, "Error while getting users");
      next(error);
    }
  }
}
