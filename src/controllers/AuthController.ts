import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { JwtPayload } from "jsonwebtoken";
import { Logger } from "winston";
import { User } from "../entity/User";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import { AuthRequest, LoginUserRequest, RegisterUserRequest } from "../types";
import createHttpError from "http-errors";
import { CredentialService } from "../services/CredentialService";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
    private credentialService: CredentialService
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

  async login(req: LoginUserRequest, res: Response, next: NextFunction) {
    // validate req body
    // return response
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json({ errors: result.array() });

    const { email, password } = req.body;

    // find user by email using userservice
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        const error = createHttpError(401, "Email or password does not match");
        next(error);
        return;
      }

      // match password
      const matchPassword = this.credentialService.comparePassword(password, user.password);
      if (!matchPassword) {
        const error = createHttpError(401, "Email or password does not match");
        next(error);
        return;
      }

      // use token service to return tokens via cookies
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      // generate accesstoken
      const accessToken = this.tokenService.generateAccessToken(payload);

      // Persist Refresh token record
      const newRefreshToken = await this.tokenService.persistToken(user);

      // generate refreshtoken
      const refreshToken = this.tokenService.generateRefreshToken({ ...payload, id: newRefreshToken.id });

      // Access Token Cookie
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });

      // Refresh Token Cookie
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
      });

      this.logger.info(`User logged in: ${user.id}`);
      res.status(200).json({ id: user.id, message: "Logged In Successfully" });
    } catch (err) {
      next(err);
      return;
    }
  }

  async self(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.auth.sub;
    try {
      const user = await this.userService.findById(Number(userId));
      res.status(200).json(user);
    } catch (err) {
      const error = createHttpError(500, "Erro while finding user by id");
      next(error);
      return;
    }
  }
}
