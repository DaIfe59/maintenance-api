"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sites", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },

      region: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      latitude: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },

      longitude: {
        type: Sequelize.DOUBLE,
        allowNull: false
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
    await queryInterface.dropTable("sites");
  }
};