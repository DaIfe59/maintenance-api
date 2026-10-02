"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE users
      SET "technicianId" = (
        SELECT id
        FROM technicians
        WHERE employee_number = 'EMP-001'
        LIMIT 1
      )
      WHERE email = 'technician@example.com';
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE users
      SET "technicianId" = NULL
      WHERE email = 'technician@example.com';
    `);
  }
};