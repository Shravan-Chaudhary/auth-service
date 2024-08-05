import { DataSource } from "typeorm";
import AppDataSource from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/entity/User";
import { RefreshToken } from "../../src/entity/RefreshToken";
import createJWKSMock, { JWKSMock } from "mock-jwks";
import { Config } from "../../src/config";
import { Roles } from "../../src/constants";
import { sign } from "jsonwebtoken";

describe("POST /auth/refresh", () => {
    let connection: DataSource;
    let jwks: JWKSMock;
    const URL = "/api/v1/auth/refresh";

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(async () => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    // Happy Path
    describe("Given valid refresh token", () => {
        it("should return 200 status code", async () => {
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
            expect(response.status).toBe(200);
        });

        it("should return new access and refresh tokens in cookies", async () => {
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

            interface Headers {
                ["set-cookie"]: string[];
            }

            // Assert
            let accessCookieToken: string | null = null;
            let refreshCookieToken: string | null = null;

            const cookies =
                (response.headers as unknown as Headers)["set-cookie"] || [];
            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken=")) {
                    accessCookieToken = cookie.split(";")[0].split("=")[1];
                }

                if (cookie.startsWith("refreshToken=")) {
                    refreshCookieToken = cookie.split(";")[0].split("=")[1];
                }
            });

            expect(accessCookieToken).not.toBeNull();
            expect(refreshCookieToken).not.toBeNull();
        });

        it("should invalidate old refresh token", async () => {
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
            await request(app)
                .post(URL)
                .set("Cookie", [`refreshToken=${refreshToken}`]);

            // Assert
            const oldRefreshToken = await refreshTokenRepository.findOne({
                where: { id: refreshTokenRecord.id },
            });
            expect(oldRefreshToken).toBeNull();
        });

        it("should return user id in response body", async () => {
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
            expect(response.body.id).toBe(String(user.id));
        });
    });

    // Sad Path
    describe("Invalid or missing refresh token", () => {
        it("should return 401 status code if refresh token is missing", async () => {
            // Act
            const response = await request(app).post(URL);

            // Assert
            expect(response.status).toBe(401);
        });

        it("should return 401 status code if refresh token is invalid", async () => {
            // Act
            const response = await request(app)
                .post(URL)
                .set("Cookie", [`refreshToken=invalid_token`]);

            // Assert
            expect(response.status).toBe(401);
        });

        it("should return 401 status code if user for token not found", async () => {
            // Arrange
            const refreshToken = sign(
                {
                    sub: "9999", // non-existent user id
                    role: Roles.CUSTOMER,
                    id: "1",
                },
                Config.REFRESH_TOKEN_SECRET!,
                { algorithm: "HS256", expiresIn: "1y", issuer: "auth-service" },
            );

            // Act
            const response = await request(app)
                .post(URL)
                .set("Cookie", [`refreshToken=${refreshToken}`]);

            // Assert
            expect(response.status).toBe(401);
        });
    });
});
