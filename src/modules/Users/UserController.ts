import { Response, NextFunction, Request } from "express";
import { CreateUserRequest } from "../../types";
import { UsersService } from "./UsersService";
import { Roles } from "../../constants";
import createHttpError from "http-errors";
import CreateHttpError from "../../common/errors/http-exceptions";
import { HttpStatus } from "../../common/enums/http-codes";
import { validationResult } from "express-validator";

export class UserController {
    constructor(private userService: UsersService) {}

    public async create(
        req: CreateUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        // validation
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(HttpStatus.BAD_REQUEST).json({ errors: result.array() });
            return;
        }

        const { firstName, lastName, email, password } = req.body;

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.MANAGER,
            });

            res.status(HttpStatus.CREATED).json({ id: user.id });
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(CreateHttpError.BadRequestError());
            return;
        }
        res.json();
    }

    public async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.findAll();
            res.status(HttpStatus.OK).json(users);
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(CreateHttpError.InternalServerError());
            return;
        }
    }

    public async findOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const user = await this.userService.findOneById(+id);
            res.status(HttpStatus.OK).json({ ...user, password: undefined });
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(CreateHttpError.InternalServerError());
            return;
        }
    }
}
