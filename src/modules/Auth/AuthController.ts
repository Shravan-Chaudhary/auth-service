import { NextFunction, Request, Response } from "express";
import {
    AuthRequest,
    IRefreshTokenPayload,
    LoginUserRequest,
    RegisterUserRequest,
} from "../../types";
import { AuthService } from "./AuthService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { ONE_HOUR, ONE_YEAR, Roles } from "../../constants";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../Token/TokenService";
import { HttpStatus } from "../../common/http/httpStatusCodes";
import createHttpError from "http-errors";
import { setCookie } from "../../utils";
import CreateHttpError from "../../common/http/httpErrors";
import { UserService } from "../Users/UserService";

interface IAuthController {
    register(req: RegisterUserRequest, res: Response, next: NextFunction): void;
    login(req: LoginUserRequest, res: Response, next: NextFunction): void;
    self(req: Request, res: Response, next: NextFunction): void;
}

export class AuthController implements IAuthController {
    authService: AuthService;
    userService: UserService;
    tokenService: TokenService;
    logger: Logger;

    constructor(
        authService: AuthService,
        userService: UserService,
        tokenService: TokenService,
        logger: Logger,
    ) {
        this.authService = authService;
        this.userService = userService;
        this.tokenService = tokenService;
        this.logger = logger;
    }

    public async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        //  validate & sanitize user input
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(HttpStatus.BAD_REQUEST).json({ errors: result.array() });
            return;
        }

        const { firstName, lastName, email, password } = req.body;

        // Debugging
        this.logger.debug("request to register a user: ", {
            firstName,
            lastName,
            email,
            password: "********",
        });

        try {
            const user = await this.authService.register({
                firstName,
                lastName,
                email,
                password,
                role: Roles.CUSTOMER,
            });
            this.logger.info("user registered with id: ", user.id);

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const refreshTokenRecord =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: refreshTokenRecord.id,
            });

            setCookie(res, "accessToken", accessToken, ONE_HOUR);
            setCookie(res, "refreshToken", refreshToken, ONE_YEAR);

            res.status(HttpStatus.CREATED).json({ id: user.id });
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(CreateHttpError.BadRequestError());
            return;
        }
    }

    public async login(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(HttpStatus.BAD_REQUEST).json({ errors: result.array() });
            return;
        }

        const { email, password } = req.body;

        try {
            const user = await this.authService.validate(email, password);
            // generate access token & refresh token
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };
            const accessToken = this.tokenService.generateAccessToken(payload);

            const refreshTokenRecord =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: refreshTokenRecord.id,
            });

            // send cookies
            setCookie(res, "accessToken", accessToken, ONE_HOUR);
            setCookie(res, "refreshToken", refreshToken, ONE_YEAR);

            res.status(HttpStatus.OK).json({ id: user.id });
        } catch (error) {
            this.logger.debug(`Auth-Controller: login Error here: ${error}`);
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(CreateHttpError.BadRequestError());
            return;
        }
    }

    public async self(req: AuthRequest, res: Response, next: NextFunction) {
        const { sub } = req.auth;

        try {
            const user = await this.userService.findOneById(Number(sub));
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
    public async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        const { sub, role, id } = req.auth;

        try {
            const user = await this.userService.findOneById(Number(sub));

            if (!user) {
                next(
                    CreateHttpError.NotFoundError(
                        "user for this token not found",
                    ),
                );
                return;
            }

            const payload: JwtPayload = {
                sub,
                role,
            };
            const accessToken = this.tokenService.generateAccessToken(payload);

            const refreshTokenRecord =
                await this.tokenService.persistRefreshToken(user);

            await this.tokenService.deleteRefreshToken(Number(id));

            const refreshTokenPayload: IRefreshTokenPayload = {
                ...payload,
                id: String(refreshTokenRecord.id),
            };
            const refreshToken =
                this.tokenService.generateRefreshToken(refreshTokenPayload);

            setCookie(res, "accessToken", accessToken, ONE_HOUR);
            setCookie(res, "refreshToken", refreshToken, ONE_YEAR);
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(CreateHttpError.InternalServerError());
            return;
        }

        res.json({ id: sub });
    }

    public async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { sub, id } = req.auth;
            await this.tokenService.deleteRefreshToken(Number(id));

            this.logger.info("user logged out", {
                id: sub,
            });

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            res.status(HttpStatus.NO_CONTENT).json({});
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
