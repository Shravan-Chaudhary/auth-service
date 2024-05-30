import express from "express";
import { AuthController } from "../controller/AuthController";
import { UserService } from "../services/UserService";

const router = express.Router();
const userService = new UserService();
const authController = new AuthController(userService);

router.post("/register", (req, res) => {
    authController.register(req, res);
});

export default router;
