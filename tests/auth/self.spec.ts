import { DataSource } from "typeorm";
import AppDataSourse from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/entity/User";
import createJWKSMock, { JWKSMock } from "mock-jwks";
import { Roles } from "../../src/constants";

describe("GET /auth/self", () => {
    let connection: DataSource;
    let jwks: JWKSMock;
    const URL = "/api/v1/auth/self";

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        connection = await AppDataSourse.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        // Clear the database before each test
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(async () => {
        jwks.stop();
    });

    afterAll(async () => {
        // Close the database connection
        await connection.destroy();
    });

    // Happy Path
    describe("Given all fields", () => {
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

            // Act
            const accessToken = jwks.token({
                sub: String(user.id),
                role: user.role,
            });

            const response = await request(app)
                .get(URL)
                .set("Cookie", [`accessToken=${accessToken}`]);

            // Assert
            expect(response.status).toBe(200);
        });

        it("should return user data json", async () => {
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

            // Act
            const accessToken = jwks.token({
                sub: String(user.id),
                role: user.role,
            });

            const response = await request(app)
                .get(URL)
                .set("Cookie", [`accessToken=${accessToken}`]);
            // Assert
            expect((response.body as Record<string, string>).id).toBe(user.id);
        });

        it.todo("should not return password");
        it.todo("should return 401 status code if token does not exists");
    });
});
