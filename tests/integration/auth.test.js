import request from "supertest";

import app from "../../src/app.js";
import sequelize from "../../src/config/database.js";
import { User } from "../../models/index.js";

const email = "integration@example.com";
const password = "Integration123!";

let accessToken;

beforeAll(async () => {
  await User.destroy({
    where: {
      email
    }
  });
});

afterAll(async () => {
  await User.destroy({
    where: {
      email
    }
  });

  await sequelize.close();
});

describe("Authentication and authorization", () => {
  test("registers a new viewer", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email,
        password
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.user.email).toBe(email);
    expect(response.body.user.role).toBe("viewer");
    expect(response.body.user).not.toHaveProperty("password");
    expect(response.body.user).not.toHaveProperty("passwordHash");
  });

  test("logs in and receives access token", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();

    accessToken = response.body.accessToken;
  });

  test("rejects protected request without token", async () => {
    const response = await request(app)
      .get("/api/requests");

    expect(response.statusCode).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  test("rejects viewer from admin operation", async () => {
    const response = await request(app)
      .post("/api/equipment")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(response.statusCode).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  test("returns conflict for duplicate registration", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email,
        password
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.error.code).toBe("CONFLICT");
  });
});
