"use strict";

const bcrypt = require("bcryptjs");
const { randomUUID } = require("node:crypto");

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const users = [
      {
        id: randomUUID(),
        email: "viewer@example.com",
        passwordHash: await bcrypt.hash(
          process.env.DEMO_VIEWER_PASSWORD || "Viewer123!",
          12
        ),
        role: "viewer",
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        email: "technician@example.com",
        passwordHash: await bcrypt.hash(
          process.env.DEMO_TECHNICIAN_PASSWORD || "Tech123!",
          12
        ),
        role: "technician",
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        email: "admin@example.com",
        passwordHash: await bcrypt.hash(
          process.env.DEMO_ADMIN_PASSWORD || "Admin123!",
          12
        ),
        role: "admin",
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const user of users) {
      const [existing] = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = :email LIMIT 1`,
        {
          replacements: { email: user.email }
        }
      );

      if (existing.length === 0) {
        await queryInterface.bulkInsert("users", [user]);
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: [
        "viewer@example.com",
        "technician@example.com",
        "admin@example.com"
      ]
    });
  }
};