import { DataSource } from "typeorm";
import AppDataSource from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenant";

describe("POST /tenants", () => {
    let connection: DataSource;
    const URL = "/api/v1/auth/tenants";

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    // Happy Path
    describe("Given all fields", () => {
        it.skip("should return 201 status code", async () => {
            // Arrange
            const tenantData = {
                name: "Sanjay Place",
                address: "Hariparwat Crossing, Agra",
            };

            // Act
            const response = await request(app).post(URL).send(tenantData);

            // Assert
            expect(response.status).toBe(201);
        });

        it.skip("should create tenant in database", async () => {
            // Arrange
            const tenantData = {
                name: "Sanjay Place",
                address: "Hariparwat Crossing, Agra",
            };

            // Act
            await request(app).post(URL).send(tenantData);

            // Assert
            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();
            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        });

        it("should return 401 if user is not authenticated", async () => {
            // Arrange
            const tenantData = {
                name: "Sanjay Place",
                address: "Hariparwat Crossing, Agra",
            };

            // Act
            const response = await request(app).post(URL).send(tenantData);

            // Assert
            expect(response.statusCode).toBe(401);
        });
    });

    it.skip("should return 403 if user is not admin", async () => {
        // Arrange
        const tenantData = {
            name: "Sanjay Place",
            address: "Hariparwat Crossing, Agra",
        };

        // Act
        const response = await request(app).post(URL).send(tenantData);

        // Assert
        expect(response.statusCode).toBe(403);
    });

    // Sad Path
    describe("", () => {
        it.skip("should return 400 status code if name is missing", async () => {
            // Arrange
            const tenantData = {
                name: "",
                address: "Hariparwat Crossing, Agra",
            };

            // Act
            const response = await request(app).post(URL).send(tenantData);
            const tenantsRepository = connection.getRepository(Tenant);
            const tenants = await tenantsRepository.find();

            // Assert
            expect(tenants).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });

        it.todo("should return 400 status code if address is missing");
    });
});
