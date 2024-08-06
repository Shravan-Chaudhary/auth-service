import { DataSource } from "typeorm";
import AppDataSource from "../../src/config/data-source";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";
import { RefreshToken } from "../../src/entity/RefreshToken";
import { sign } from "jsonwebtoken";
import { Config } from "../../src/config";
import request from "supertest";
import app from "../../src/app";

describe("POST /auth/logout", () => {
    let connection: DataSource;
    const URL = "/api/v1/auth/logout";

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    // Happy Path
    describe("Given valid refresh token", () => {
        it("should return 204 status code", async () => {
            // Arrange
            const userData = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
                role: Roles.CUSTOMER,
            };

            const userRepository = connection.getRepository(User);
            const user = await userRepository.save(userData);

            const refreshTokenRepository =
                connection.getRepository(RefreshToken);
            const refreshTokenRecord = await refreshTokenRepository.save({
                user: user,
                expiresAt: new Date(Date.now() + 3600 * 1000 * 24 * 365),
            });

            const refreshToken = sign(
                {
                    sub: String(user.id),
                    role: user.role,
                    id: String(refreshTokenRecord.id),
                },
                Config.REFRESH_TOKEN_SECRET!,
                { algorithm: "HS256", expiresIn: "1y", issuer: "auth-service" },
            );

            // Act
            const response = await request(app)
                .post(URL)
                .set("Cookie", [`refreshToken=${refreshToken}`]);

            // Assert
            expect(response.status).toBe(204);
        });
    });
    // Sad Path
    describe("Given invalid refresh token", () => {
        it("should return 401 status code", async () => {
            // Act
            const response = await request(app)
                .post(URL)
                .set("Cookie", [`refreshToken=invalid_token`]);

            // Assert
            expect(response.status).toBe(401);
        });
    });
});
