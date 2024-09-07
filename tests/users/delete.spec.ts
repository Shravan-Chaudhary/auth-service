import { DataSource } from "typeorm";
import AppDataSource from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import createJWKSMock, { JWKSMock } from "mock-jwks";
import { User } from "../../src/entity/User";

describe("DELETE /users/:id", () => {
    let connection: DataSource;
    let jwks: JWKSMock;
    const URL = "/api/v1/users";

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
        it("should return 204 status code", async () => {
            // Arrange
            const userData = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
                tenantId: 1,
                role: Roles.MANAGER,
            };

            const userRepository = connection.getRepository(User);
            const savedUser = await userRepository.save(userData);

            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Act
            const response = await request(app)
                .delete(`${URL}/${savedUser.id}`)
                .set("Cookie", [`accessToken=${adminToken}`]);

            // Assert
            expect(response.statusCode).toBe(204);
        });

        it("should delete the user from database", async () => {
            // Arrange
            const userData = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
                tenantId: 1,
                role: Roles.MANAGER,
            };

            const userRepository = connection.getRepository(User);
            const savedUser = await userRepository.save(userData);

            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Act
            await request(app)
                .delete(`${URL}/${savedUser.id}`)
                .set("Cookie", [`accessToken=${adminToken}`]);

            // Assert
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
    });

    // Sad Path
    describe("Error cases", () => {});
});
