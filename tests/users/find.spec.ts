import { DataSource } from "typeorm";
import AppDataSource from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import createJWKSMock, { JWKSMock } from "mock-jwks";

describe("GET /users", () => {
    let connection: DataSource;
    let jwks: JWKSMock;
    const URL = "/api/v1/users/";

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
    describe("Given all fields", () => {
        it("should return 200 status code", async () => {
            // Arrange
            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Act
            const response = await request(app)
                .get(URL)
                .set("Cookie", [`accessToken=${adminToken}`]);

            // Assert
            expect(response.statusCode).toBe(200);
        });
    });

    // Sad Path
    describe("Error cases", () => {});
});
