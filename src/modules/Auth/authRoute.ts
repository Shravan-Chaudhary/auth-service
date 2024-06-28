import express, { RequestHandler } from "express";
import { AuthController } from "./AuthController";
import AppDataSource from "../../config/data-source";
import { User } from "../../entity/User";
import logger from "../../config/logger";
import { AuthService } from "./AuthService";
import registerValidator from "../../validators/register-validator";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService, logger);

router.post("/register", registerValidator, (async (req, res, next) => {
    await authController.register(req, res, next);
}) as RequestHandler);

export default router;
