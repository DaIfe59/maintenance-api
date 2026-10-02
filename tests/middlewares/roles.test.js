import { requireRoles } from "../../src/middlewares/roles.js";

describe("Role authorization", () => {
  test("allows user with required role", () => {
    const req = {
      user: {
        id: "1",
        role: "admin"
      }
    };

    const res = {};

    let called = false;

    const next = () => {
      called = true;
    };

    requireRoles("admin")(req, res, next);

    expect(called).toBe(true);
  });

  test("denies user without required role", () => {
    const req = {
      user: {
        id: "1",
        role: "viewer"
      }
    };

    const res = {};

    let error;

    const next = value => {
      error = value;
    };

    requireRoles("admin")(req, res, next);

    expect(error).toBeDefined();
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe("FORBIDDEN");
  });
});