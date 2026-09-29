"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("technicians", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      full_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },

      specialization: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      employee_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("technicians");
  }
};