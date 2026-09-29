import { DataTypes } from "sequelize";
import sequelize from "../src/config/database.js";

const RequestAssignee = sequelize.define(
  "RequestAssignee",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },

    requestId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "request_id"
    },

    technicianId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "technician_id"
    },

    role: {
      type: DataTypes.ENUM("lead", "member"),
      allowNull: false
    },

    hours: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    }
  },
  {
    tableName: "request_assignees",
    timestamps: true
  }
);

export default RequestAssignee;