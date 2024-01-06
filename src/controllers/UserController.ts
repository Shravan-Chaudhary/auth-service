import { NextFunction, Response } from "express";
import { UserService } from "../services/UserService";
import { Roles } from "../constants";
import { CreateUserRequest } from "../types";
import { validationResult } from "express-validator";
import { Logger } from "winston";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger
  ) {}

  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    //TODO: validation and sanitization of request body
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
}
