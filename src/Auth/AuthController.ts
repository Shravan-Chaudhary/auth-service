import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { IAuthService } from "./AuthService";
import { Logger } from "winston";

interface IAuthController {
    register(req: RegisterUserRequest, res: Response, next: NextFunction): void;
}

export class AuthController implements IAuthController {
    authService: IAuthService;
    logger: Logger;

    constructor(authService: IAuthService, logger: Logger) {
        this.authService = authService;
        this.logger = logger;
    }
    public async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        //  validate & sanitize user input
        // check if user exists
        const { firstName, lastName, email, password } = req.body;

        try {
            const user = await this.authService.create({
                firstName,
                lastName,
                email,
                password,
            });

            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}
