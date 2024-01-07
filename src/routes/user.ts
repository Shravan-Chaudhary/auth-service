import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { Roles } from "../constants";
import { UserController } from "../controllers/UserController";
import { User } from "../entity/User";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { UserService } from "../services/UserService";
import { CreateUserRequest, UpdateUserRequest } from "../types";
import createUserValidator from "../validators/create-user-validator";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

router.post(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  createUserValidator,
  (req: Request, res: Response, next: NextFunction) => userController.create(req as CreateUserRequest, res, next)
);

router.get("/", authenticate, canAccess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
  userController.getAllUsers(req, res, next)
);

router.get("/:id", authenticate, canAccess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
  userController.getUserById(req, res, next)
);

router.patch("/:id", authenticate, canAccess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
  userController.updateUser(req as UpdateUserRequest, res, next)
);

export default router;
