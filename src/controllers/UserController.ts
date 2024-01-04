import { NextFunction, Response } from "express";
import { UserService } from "../services/UserService";
import { Roles } from "../constants";
import { CreateUserRequest } from "../types";

export class UserController {
  constructor(private userService: UserService) {}

  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    //TODO: validation and sanitization of request body
    const { firstName, lastName, email, password } = req.body;
    // Create user using userService
    try {
      const user = await this.userService.create({ firstName, lastName, email, password, role: Roles.MANAGER });
      res.status(201).json({ id: user.id });
    } catch (err) {
      next(err);
    }
  }
}
