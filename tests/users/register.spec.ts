import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
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
            const response = await request(app).post("/auth/register");

            // Assert
            expect(response.status).toBe(201);
        });
    });

    describe("Given all fields", () => {});
});
