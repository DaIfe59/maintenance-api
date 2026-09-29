"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("equipment_passports", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      equipment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: "equipment",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      manufacturer: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      model: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      nominal_power: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },

      last_verification_at: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable("equipment_passports");
  }
};