import { Response, NextFunction, Request } from "express";
import { CreateUserRequest, UpdateUserRequest } from "../../types";
import { UserService } from "./UserService";
import createHttpError from "http-errors";
import CreateHttpError from "../../common/http/httpErrors";
import { HttpStatus } from "../../common/http/httpStatusCodes";
import { validationResult } from "express-validator";
import { TenantsService } from "../Tenants/TenantsService";
import httpResponse from "../../common/http/httpResponse";
import ResponseMessage from "../../common/constants/responseMessage";

export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly tenantService: TenantsService,
    ) {}

    public async create(
        req: CreateUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            // validation
            const result = validationResult(req);

            if (!result.isEmpty()) {
                const err = CreateHttpError.BadRequestError(
                    result.array()[0].msg as string,
                );
                throw err;
            }

            const { firstName, lastName, email, password, role, tenantId } =
                req.body;

            const tenant = await this.tenantService.findOneById(+tenantId!);

            const user = await this.userService.create(
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    role,
                },
                tenant,
            );

            httpResponse(
                req,
                res,
                HttpStatus.CREATED,
                ResponseMessage.CREATED,
                { id: user.id },
            );
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(CreateHttpError.BadRequestError());
            return;
        }
    }

    public async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.findAll();
            httpResponse(
                req,
                res,
                HttpStatus.OK,
                ResponseMessage.SUCCESS,
                users,
            );
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
            httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
                ...user,
                password: undefined,
            });
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(CreateHttpError.InternalServerError());
            return;
        }
    }

    public async update(
        req: UpdateUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            // validate
            const result = validationResult(req);
            if (!result.isEmpty()) {
                const err = CreateHttpError.BadRequestError(
                    result.array()[0].msg as string,
                );
                throw err;
            }
            const { firstName, lastName, role } = req.body;
            const { id } = req.params;

            const user = await this.userService.update(+id, {
                firstName,
                lastName,
                role,
            });
            httpResponse(
                req,
                res,
                HttpStatus.OK,
                ResponseMessage.SUCCESS,
                user,
            );
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(CreateHttpError.InternalServerError());
            return;
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            await this.userService.delete(Number(id));
            httpResponse(
                req,
                res,
                HttpStatus.NO_CONTENT,
                ResponseMessage.PARTIAL_CONTENT,
                null,
            );
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
