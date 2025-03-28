import fs from "node:fs";
import path from "node:path";
import { JwtPayload, sign } from "jsonwebtoken";
import { Config } from "../../config";
import { RefreshToken } from "../../entity/RefreshToken";
import { Repository } from "typeorm";
import { User } from "../../entity/User";
import { ONE_YEAR } from "../../constants";
import CreateHttpError from "../../common/http/httpErrors";

export class TokenService {
    refreshTokenRepository: Repository<RefreshToken>;
    constructor(refreshTokenRepository: Repository<RefreshToken>) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer;

        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, "../../../certs/private.pem"),
            );
            if (!privateKey && Config.PRIVATE_KEY) {
                privateKey = Buffer.from(Config.PRIVATE_KEY);
            }
        } catch (_error) {
            const err = CreateHttpError.InternalServerError(
                "error while reading private key",
            );
            throw err;
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "auth-service",
        });

        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth-service",
            jwtid: String(payload.id),
        });

        return refreshToken;
    }

    async persistRefreshToken(user: User) {
        const refreshTokenRecord = await this.refreshTokenRepository.save({
            user: user,
            expiresAt: new Date(Date.now() + ONE_YEAR),
        });
        return refreshTokenRecord;
    }

    public async deleteRefreshToken(tokenId: number) {
        return await this.refreshTokenRepository.delete({
            id: tokenId,
        });
    }
}
