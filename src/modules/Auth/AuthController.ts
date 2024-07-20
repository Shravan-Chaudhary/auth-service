import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../../types";
import { IAuthService } from "./AuthService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { ONE_HOUR, ONE_YEAR, Roles } from "../../constants";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../Token/TokenService";
import { Http } from "../../common/enums/http-codes";
import { createBadRequestError } from "../../common/errors/http-exceptions";
import createHttpError from "http-errors";
import { setCookie } from "../../utils";

interface IAuthController {
    register(req: RegisterUserRequest, res: Response, next: NextFunction): void;
    login(req: RegisterUserRequest, res: Response, next: NextFunction): void;
}

export class AuthController implements IAuthController {
    authService: IAuthService;
    tokenService: TokenService;
    logger: Logger;

    constructor(
        authService: IAuthService,
        tokenService: TokenService,
        logger: Logger,
    ) {
        this.authService = authService;
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
            res.status(Http.BAD_REQUEST).json({ errors: result.array() });
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

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: ONE_HOUR,
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: ONE_YEAR,
                httpOnly: true,
            });

            res.status(Http.CREATED).json({ id: user.id });
        } catch (error) {
            next(error);
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
            res.status(Http.BAD_REQUEST).json({ errors: result.array() });
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

            res.status(Http.OK).json({ id: user.id });
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(createBadRequestError("email or password does not match"));
            return;
        }
    }
}
