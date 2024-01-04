import express, { NextFunction, Request, Response } from "express";
import { Roles } from "../constants";
import { UserController } from "../controllers/UserController";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { CreateUserRequest } from "../types";
import tenantValidator from "../validators/tenant-validator";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  tenantValidator,
  (req: Request, res: Response, next: NextFunction) => userController.create(req as CreateUserRequest, res, next)
);

export default router;
