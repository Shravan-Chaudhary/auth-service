import { JwtPayload, sign } from "jsonwebtoken";
import { Config } from "../../config";
import { createInternalServerError } from "../../common/errors/http-exceptions";
import { RefreshToken } from "../../entity/RefreshToken";
import { Repository } from "typeorm";
import { User } from "../../entity/User";
import { ONE_YEAR } from "../../constants";

export class TokenService {
    refreshTokenRepository: Repository<RefreshToken>;
    constructor(refreshTokenRepository: Repository<RefreshToken>) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    generateAccessToken(payload: JwtPayload) {
        let privateKey: string;

        // Read private key from file later
        if (!Config.PRIVATE_KEY) {
            const err = createInternalServerError("private key not found");
            throw err;
        }
        try {
            privateKey = Config.PRIVATE_KEY;
        } catch (error) {
            const err = createInternalServerError(
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
