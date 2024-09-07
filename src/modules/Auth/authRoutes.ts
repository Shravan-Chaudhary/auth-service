import express, { RequestHandler } from "express";
import { AuthController } from "./AuthController";
import AppDataSource from "../../config/data-source";
import { User } from "../../entity/User";
import logger from "../../config/logger";
import { AuthService } from "./AuthService";
import registerValidator from "../../validators/register-validator";
import { UserService } from "../Users/UserService";
import { TokenService } from "../Token/TokenService";
import { RefreshToken } from "../../entity/RefreshToken";
import loginValidator from "../../validators/login-validator";
import { CredentialsService } from "../Credentials/CredentialsService";
import authenticate from "../../common/middlewares/authenticate";
import { AuthRequest } from "../../types";
import validateRefreshToken from "../../common/middlewares/validateRefreshToken";
import parseRefreshToken from "../../common/middlewares/parseRefreshToken";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const credentialService = new CredentialsService();
const userService = new UserService(credentialService, userRepository);
const tokenService = new TokenService(refreshTokenRepository);
const authService = new AuthService(
    userService,
    credentialService,
    userRepository,
);
const authController = new AuthController(
    authService,
    userService,
    tokenService,
    logger,
);

router.post("/register", registerValidator, (async (req, res, next) => {
    await authController.register(req, res, next);
}) as RequestHandler);

router.post("/login", loginValidator, (async (req, res, next) => {
    await authController.login(req, res, next);
}) as RequestHandler);

router.get("/self", authenticate, (async (req, res, next) => {
    await authController.self(req as AuthRequest, res, next);
}) as RequestHandler);

router.post("/refresh", validateRefreshToken, (async (req, res, next) => {
    await authController.refresh(req as AuthRequest, res, next);
}) as RequestHandler);

router.post("/logout", parseRefreshToken, (async (req, res, next) => {
    await authController.logout(req as AuthRequest, res, next);
}) as RequestHandler);

export default router;
