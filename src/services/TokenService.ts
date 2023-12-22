import { JwtPayload, sign } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import createHttpError from "http-errors";
import { RefreshToken } from "../entity/RefreshToken";
import { Config } from "../config";
import { User } from "../entity/User";
import { Repository } from "typeorm";

export class TokenService {
  constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

  async generateAccessToken(payload: JwtPayload) {
    let privateKey: Buffer;
    try {
      privateKey = fs.readFileSync(path.join(__dirname, "../../certs/private.pem"));
    } catch (err) {
      const error = createHttpError(500, "Error while reading private key");
      throw error;
    }
    const accessToken = sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: "auth-service",
    });

    return accessToken;
  }

  async generateRefreshToken(payload: JwtPayload) {
    const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
      algorithm: "HS256",
      expiresIn: "1y",
      issuer: "auth-service",
      jwtid: String(payload.id),
    });

    return refreshToken;
  }

  async persistToken(user: User) {
    const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365; // 1YR
    const newRefreshToken = await this.refreshTokenRepository.save({
      user: user,
      expiresAt: new Date(Date.now() + YEAR_IN_MS),
    });

    return newRefreshToken;
  }
}
