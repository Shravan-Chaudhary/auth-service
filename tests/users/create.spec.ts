import { DataSource } from "typeorm";
import AppDataSource from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import createJWKSMock, { JWKSMock } from "mock-jwks";
import { User } from "../../src/entity/User";
import { createTenant } from "../utils";
import { Tenant } from "../../src/entity/Tenant";

describe("POST /users", () => {
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
        it("should persist the user in database", async () => {
            // Arrange
            const tenant = await createTenant(connection.getRepository(Tenant));

            const user = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
                tenantId: tenant.id,
                role: Roles.MANAGER,
            };
            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Act
            await request(app)
                .post(URL)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(user);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            // Assert
            expect(users).toHaveLength(1);
            expect(users[0].email).toBe(user.email);
            expect(users[0].role).toBe(Roles.MANAGER);
        });

        it("should store manager user", async () => {
            // Arrange
            const tenant = await createTenant(connection.getRepository(Tenant));

            const user = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
                tenantId: tenant.id,
                role: Roles.MANAGER,
            };
            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Act
            await request(app)
                .post(URL)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(user);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            // Assert
            expect(users).toHaveLength(1);
            expect(users[0].role).toBe(Roles.MANAGER);
        });

        it("should return 403 if non admin user tries to create a user", async () => {
            // Arrange
            const user = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
                tenantId: 1,
                role: Roles.MANAGER,
            };
            const adminToken = jwks.token({
                sub: "1",
                role: Roles.MANAGER,
            });

            // Act
            const response = await request(app)
                .post(URL)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(user);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            // Assert
            expect(response.statusCode).toBe(403);
            expect(users).toHaveLength(0);
        });
    });

    // Sad Path
    describe("Fields are missing", () => {
        it("should return 400 status code if firstName is missing", async () => {
            // Arrange
            const user = {
                firstName: "",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
                tenantId: 1,
                role: Roles.MANAGER,
            };
            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Act
            const response = await request(app)
                .post(URL)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(user);

            // Assert
            expect(response.statusCode).toBe(400);
        });
    });
});
