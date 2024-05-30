import { Response } from "express";
import { RegisterUserRequest } from "../types";
import { IUserService } from "../services/UserService";

export class AuthController {
    userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }
    public async register(req: RegisterUserRequest, res: Response) {
        //  validate & sanitize user input
        // check if user exists
        const { firstName, lastName, email, password } = req.body;
        const user = await this.userService.create({
            firstName,
            lastName,
            email,
            password,
        });

        res.status(201).json({ message: user.id.toString() });
    }
}
