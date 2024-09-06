import { DataSource } from "typeorm";
import AppDataSource from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import createJWKSMock, { JWKSMock } from "mock-jwks";
import { User } from "../../src/entity/User";

describe("PATCH /users/:id", () => {
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
        it("should update the manager user when admin makes the request", async () => {
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

            const updateUserData = {
                firstName: "Vansh",
                lastName: "Chadda",
                role: Roles.MANAGER,
            };
            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Act
            await request(app)
                .patch(`${URL}/${savedUser.id}`)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(updateUserData);

            // Assert
            const updatedUser = await userRepository.find();
            expect(updatedUser[0].firstName).toBe(updateUserData.firstName);
            expect(updatedUser[0].lastName).toBe(updateUserData.lastName);
        });
    });

    // Sad Path
    describe("Error cases", () => {
        it("should return 403 if non-admin user tries to update a manager", async () => {});

        it("should return 404 if the user to update doesn't exist", async () => {});
    });
});
