import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import fs from "fs";
import createHttpError from "http-errors";
import { JwtPayload, sign } from "jsonwebtoken";
import path from "path";
import { Logger } from "winston";
import { Config } from "../config";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    // validate request body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    this.logger.debug("New Request to register a user", { firstName, lastName, email, password: "****" });

    try {
      const user: User = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });
      this.logger.info("User registered", { id: user.id });

      // generate JWT token
      let privateKey: Buffer;
      try {
        privateKey = fs.readFileSync(path.join(__dirname, "../../certs/private.pem"));
      } catch (err) {
        const error = createHttpError(500, "Error while reading private key");
        next(error);
        return;
      }
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };
      const accessToken = sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "auth-service",
      });

      // Persist Refresh Token
      const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365; // 1YR
      const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
      const newRefreshToken = await refreshTokenRepository.save({
        user: user,
        expiresAt: new Date(Date.now() + YEAR_IN_MS),
      });

      const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
        algorithm: "HS256",
        expiresIn: "1y",
        issuer: "auth-service",
        jwtid: String(newRefreshToken.id),
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
      });

      res.status(201).json({ id: user.id });
    } catch (err) {
      next(err);
      return;
    }
  }
}
