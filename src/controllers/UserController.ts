import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { Roles } from "../constants";
import { UserService } from "../services/UserService";
import { CreateUserRequest, UpdateUserRequest } from "../types";

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

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
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

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.id);
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        const error = createHttpError(404, "User not found");
        next(error);
        return;
      }
      res.status(200).json({ ...user, password: undefined }); // send user data without password
    } catch (err) {
      const error = createHttpError(500, "Error while getting user");
      next(error);
    }
  }

  async updateUser(req: UpdateUserRequest, res: Response, next: NextFunction) {
    // Validate req body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const { firstName, lastName, role } = req.body;

    // check the req params id
    const tenantId = req.params.id;
    if (isNaN(Number(tenantId))) {
      const error = createHttpError(400, "Invalid url param");
      next(error);
      return;
    }
    const userId = parseInt(req.params.id);
    try {
      const updatedUser = await this.userService.update(userId, {
        firstName,
        lastName,
        role,
      });
      res.status(200).json({ ...updatedUser, password: undefined }); // send user data without password
    } catch (err) {
      const error = createHttpError(500, "Error while updating user");
      next(error);
    }
  }
}
