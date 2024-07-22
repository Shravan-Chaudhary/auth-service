import { DataSource } from "typeorm";
import AppDataSourse from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";

describe("GET /auth/self", () => {
    let connection: DataSource;
    const URL = "/api/v1/auth/self";

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
            const response = await request(app).get(URL);
            expect(response.status).toBe(200);
        });

        it("should return user data json", async () => {});
    });
});
