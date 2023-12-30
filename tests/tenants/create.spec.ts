import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { Tenant } from "../../src/entity/Tenant";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/constants";

describe("POST /tenants", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5501");
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // Database truncate
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

  describe("Given all fields", () => {});
  it("should return 201", async () => {
    // Arrange
    const tenantData = {
      name: "John",
      address: "tenant address",
    };

    // Generate token
    const adminToken = jwks.token({
      sub: "1",
      role: Roles.ADMIN,
    });

    // Act
    const response = await request(app)
      .post("/tenants")
      .set("Cookie", [`accessToken=${adminToken}`])
      .send(tenantData);

    // Assert
    expect(response.statusCode).toBe(201);
  });

  it("should create a tenant in database", async () => {
    // Arrange
    const tenantData = {
      name: "John",
      address: "tenant address",
    };

    // Generate token
    const adminToken = jwks.token({
      sub: "1",
      role: Roles.ADMIN,
    });

    // Act
    await request(app)
      .post("/tenants")
      .set("Cookie", [`accessToken=${adminToken}`])
      .send(tenantData);

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
      name: "John",
      address: "tenant address",
    };

    // Act
    const response = await request(app).post("/tenants").send(tenantData);

    // Assert
    const tenantRepository = connection.getRepository(Tenant);
    const tenants = await tenantRepository.find();
    expect(response.statusCode).toBe(401);
    expect(tenants).toHaveLength(0);
  });
});
