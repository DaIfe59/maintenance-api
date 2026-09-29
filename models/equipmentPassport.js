import { DataTypes } from "sequelize";
import sequelize from "../src/config/database.js";

const EquipmentPassport = sequelize.define(
  "EquipmentPassport",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },

    equipmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: "equipment_id"
    },

    manufacturer: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    model: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    nominalPower: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "nominal_power"
    },

    lastVerificationAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_verification_at"
    }
  },
  {
    tableName: "equipment_passports",
    timestamps: true
  }
);

export default EquipmentPassport;