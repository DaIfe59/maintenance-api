import { DataTypes } from "sequelize";
import sequelize from "../src/config/database.js";

const MaintenanceRequest = sequelize.define(
  "MaintenanceRequest",
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
      field: "equipment_id"
    },

    title: {
      type: DataTypes.STRING(120),
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    priority: {
      type: DataTypes.ENUM(
        "low",
        "medium",
        "high",
        "critical"
      ),
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM(
        "new",
        "in_progress",
        "done",
        "rejected"
      ),
      allowNull: false,
      defaultValue: "new"
    },

    plannedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "planned_at"
    },

    author: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  },
  {
    tableName: "maintenance_requests",
    timestamps: true
  }
);

export default MaintenanceRequest;