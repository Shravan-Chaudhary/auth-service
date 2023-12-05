import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { JwtPayload } from "jsonwebtoken";
import { Logger } from "winston";
import { User } from "../entity/User";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService
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

      // payload for tokens
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      // generate accessToken
      const accessToken = this.tokenService.generateAccessToken(payload);

      // Persist Refresh Token Record
      const newRefreshToken = await this.tokenService.persistToken(user);

      // generate RefreshToken
      const refreshToken = this.tokenService.generateRefreshToken({ ...payload, id: String(newRefreshToken.id) });

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
