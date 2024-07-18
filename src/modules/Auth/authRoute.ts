import express, { RequestHandler } from "express";
import { AuthController } from "./AuthController";
import AppDataSource from "../../config/data-source";
import { User } from "../../entity/User";
import logger from "../../config/logger";
import { AuthService } from "./AuthService";
import registerValidator from "../../validators/register-validator";
import { UserService } from "../User/UserService";
import { TokenService } from "../Token/TokenService";
import { RefreshToken } from "../../entity/RefreshToken";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const userService = new UserService(userRepository);
const tokenService = new TokenService(refreshTokenRepository);
const authService = new AuthService(userService, userRepository);
const authController = new AuthController(authService, tokenService, logger);

router.post("/register", registerValidator, (async (req, res, next) => {
    await authController.register(req, res, next);
}) as RequestHandler);

export default router;
