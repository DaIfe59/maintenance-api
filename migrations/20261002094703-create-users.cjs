"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },

      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },

      role: {
        type: DataTypes.ENUM(
          "viewer",
          "technician",
          "admin"
        ),
        allowNull: false,
        defaultValue: "viewer"
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },

      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_role";'
    );
  }
};