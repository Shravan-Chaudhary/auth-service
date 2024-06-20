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
        await connection.synchronize();
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
            expect(users[0].email).toBe(user.email);
            expect(users[0].firstName).toBe(user.firstName);
            expect(users[0].lastName).toBe(user.lastName);
        });

        it("should return an id of created user", async () => {
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
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(users[0].id);
        });

        it("should assign customer role", async () => {
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
            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toEqual("customer");
        });

        it("should store hashed password in database", async () => {
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
            expect(users[0].password).not.toBe(user.password);

            // hash is made up of (algo, cost, salt, hash). Idea is to match the starting expression
            expect(users[0].password).toHaveLength(60); // 60 is the length of the hash
            expect(users[0].password).toMatch(/^\$2[a|b]\$\d+\$/);
        });

        it("should return 409 status code if email aldready exists", async () => {
            // Arrange
            const user = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
            };

            const userRepository = connection.getRepository(User);
            userRepository.save({ ...user, role: "customer" });

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(user);

            // Assert
            const users = await userRepository.find();
            expect(response.statusCode).toBe(409);
            expect(users).toHaveLength(1);
        });
    });

    // Sad path
    describe("Fields are missing", () => {
        it("should return 400 status code if email is missing", async () => {
            // Arrange
            const user = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "",
                password: "password",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(user);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });

        it("should return 400 status code if firstName is missing", async () => {
            // Arrange
            const user = {
                firstName: "",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "password",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(user);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });

        it("should return 400 status code if lastName is missing", async () => {
            // Arrange
            const user = {
                firstName: "Shravan",
                lastName: "",
                email: "shravan@gmail.com",
                password: "password",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(user);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });

        it("should return 400 status code if password is missing", async () => {
            // Arrange
            const user = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: "shravan@gmail.com",
                password: "",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(user);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });
    });

    //
    describe("Fields are not in proper format", () => {
        it("should trim email", async () => {
            // Arrange
            const user = {
                firstName: "Shravan",
                lastName: "Chaudhary",
                email: " shravan@gmail.com",
                password: "password",
            };

            // Act
            await request(app).post("/auth/register").send(user);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users[0].email).toBe("shravan@gmail.com");
        });

        it.todo("should return 400 status code if email is not valid");
        it.todo(
            "should return 400 status code if password length is less than 6 characters",
        );
    });
});
