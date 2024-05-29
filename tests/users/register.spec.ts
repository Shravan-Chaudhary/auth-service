import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import AppDataSourse from "../../src/config/data-source";
import { User } from "../../src/entity/User";

describe("POST /auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        // Initialize the database connection
        connection = await AppDataSourse.initialize();
    });

    beforeEach(async () => {
        // Clear the database before each test
        await connection.dropDatabase();
        // await connection.synchronize();
    });

    afterAll(async () => {
        // Close the database connection
        await connection.destroy();
    });

    // Happy Path
    describe("Given all fields", () => {
        it("should return 201 status code", async () => {
            // Arrange
            const user = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(user);

            // Assert
            expect(response.status).toBe(201);
        });

        it("should return valid json", async () => {
            // Arrange
            const user = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(user);

            // Assert
            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should persist user in database", async () => {
            // Arrange
            const user = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
            };

            // Act
            await request(app).post("/auth/register").send(user);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
        });
    });

    describe("Given all fields", () => {});
});
