import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../../types";
import { IAuthService } from "./AuthService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { ONE_HOUR, ONE_YEAR } from "../../constants";
import { JwtPayload, sign } from "jsonwebtoken";
import { createInternalServerError } from "../../common/errors/http-exceptions";
import { Config } from "../../config";

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
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
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
            });
            this.logger.info("user registered with id: ", user.id);

            // generate keys and read from keys
            // let privateKey: Buffer;
            let privateKey: string;

            if (!Config.PRIVATE_KEY) {
                const err = createInternalServerError("private key not found");
                next(err);
                return;
            }
            try {
                privateKey = Config.PRIVATE_KEY;
            } catch (error) {
                const err = createInternalServerError(
                    "error while reading private key",
                );
                next(err);
                return;
            }

            // generate tokens
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = sign(payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service",
            });

            const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
                algorithm: "HS256",
                expiresIn: "1y",
                issuer: "auth-service",
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
            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}
