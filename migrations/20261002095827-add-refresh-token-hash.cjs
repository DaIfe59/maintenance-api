"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn("users", "refreshTokenHash", {
      type: DataTypes.STRING(64),
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      "users",
      "refreshTokenHash"
    );
  }
};