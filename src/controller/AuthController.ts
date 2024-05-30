import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { IUserService } from "../services/UserService";
import { Logger } from "winston";

export class AuthController {
    userService: IUserService;
    logger: Logger;

    constructor(userService: IUserService, logger: Logger) {
        this.userService = userService;
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
            const user = await this.userService.create({
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
