import { DataTypes } from "sequelize";
import sequelize from "../src/config/database.js";

const Equipment = sequelize.define(
  "Equipment",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },

    siteId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "site_id"
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    type: {
      type: DataTypes.ENUM(
        "turbine",
        "inverter",
        "sensor",
        "substation"
      ),
      allowNull: false
    },

    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "serial_number"
    },

    status: {
      type: DataTypes.ENUM(
        "operational",
        "maintenance",
        "fault",
        "decommissioned"
      ),
      allowNull: false,
      defaultValue: "operational"
    },

    installedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "installed_at"
    }
  },
  {
    tableName: "equipment",
    timestamps: true
  }
);

export default Equipment;