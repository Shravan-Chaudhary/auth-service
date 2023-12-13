import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import createJWKSMock from "mock-jwks";
import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("GET /auth/self", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

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

  describe("Given all fields", () => {
    // it("should return 200 status code", async () => {
    //   // generate token
    //   const accessToken = jwks.token({
    //     sub: "6",
    //     role: Roles.CUSTOMER,
    //   });

    //   const response = await request(app)
    //     .get("/auth/self")
    //     .set("Cookie", [`accessToken=${accessToken};`])
    //     .send();
    //   expect(response.statusCode).toBe(200);
    // });

    it("should return the user data", async () => {
      // Register User
      const userData = {
        firstName: "Shravan",
        lastName: "Chaudhary",
        email: "shravan@gmail.com",
        password: "password",
      };
      const userRepository = connection.getRepository(User);
      const registeredUser = await userRepository.save({ ...userData, role: Roles.CUSTOMER });
      // Generate Token
      const accessToken = jwks.token({
        sub: String(registeredUser.id),
        role: registeredUser.role,
      });
      // Add token to cookie
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();
      // Assert
      // Check if user id matches with registered user
      expect((response.body as Record<string, string>).id).toBe(registeredUser.id);
    });

    it("should not return password with user", async () => {
      // Register User
      const userData = {
        firstName: "Shravan",
        lastName: "Chaudhary",
        email: "shravan@gmail.com",
        password: "secretpassword",
      };
      const userRepository = connection.getRepository(User);
      const registeredUser = await userRepository.save({ ...userData, role: Roles.CUSTOMER });
      // Generate Token
      const accessToken = jwks.token({
        sub: String(registeredUser.id),
        role: registeredUser.role,
      });
      // Add token to cookie
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();
      // Assert
      // Check the user is returned without password
      expect((response.body as Record<string, string>).password).toBeUndefined();
    });
  });
});
