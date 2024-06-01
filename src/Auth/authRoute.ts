import express from "express";
import { AuthController } from "./AuthController";
import AppDataSource from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import { AuthService } from "./AuthService";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService, logger);

router.post("/register", (req, res, next) => {
    authController.register(req, res, next);
});

export default router;