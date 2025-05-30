import { expressjwt } from "express-jwt";
import { Request } from "express";
import { Config } from "../../config";
import { AuthCookie, IRefreshTokenPayload } from "../../types";
import { RefreshToken } from "../../entity/RefreshToken";
import AppDataSource from "../../config/data-source";
import logger from "../../config/logger";

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ["HS256"],

    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie;
        return refreshToken;
    },

    async isRevoked(_req: Request, token) {
        try {
            const refreshTokenRepository =
                AppDataSource.getRepository(RefreshToken);
            const refreshToken = await refreshTokenRepository.findOne({
                where: {
                    id: Number((token?.payload as IRefreshTokenPayload).id),
                    user: {
                        id: Number(token?.payload.sub),
                    },
                },
            });

            return refreshToken === null;
        } catch (_error) {
            logger.error("error while getting the refresh token", {
                id: (token?.payload as IRefreshTokenPayload).id,
            });

            return true;
        }
    },
});
