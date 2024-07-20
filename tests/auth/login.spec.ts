import { DataSource } from "typeorm";
import AppDataSourse from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";

describe("POST /auth/login", () => {
    let connection: DataSource;
    const URL = "/api/v1/auth/login";

    beforeAll(async () => {
        // Initialize the database connection
        connection = await AppDataSourse.initialize();
    });

    beforeEach(async () => {
        // Clear the database before each test
        await connection.dropDatabase();
        await connection.synchronize();
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
            };
            await request(app).post("/api/v1/auth/register").send(userData);

            // Act
            const response = await request(app).post(URL).send({
                email: "shravan@gmail.com",
                password: "password",
            });

            // Assert
            expect(response.status).toBe(200);
        });

        it("should return a valid json response", async () => {
            // Arrange
            const userData = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
            };
            await request(app).post("/api/v1/auth/register").send(userData);

            // Act
            const response = await request(app).post(URL).send({
                email: userData.email,
                password: userData.password,
            });

            // Assert
            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });
    });
});
