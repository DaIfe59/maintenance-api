import { DataTypes } from "sequelize";
import sequelize from "../src/config/database.js";

const RequestStatusHistory = sequelize.define(
  "RequestStatusHistory",
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

    previousStatus: {
      type: DataTypes.ENUM(
        "new",
        "in_progress",
        "done",
        "rejected"
      ),
      allowNull: true,
      field: "previous_status"
    },

    newStatus: {
      type: DataTypes.ENUM(
        "new",
        "in_progress",
        "done",
        "rejected"
      ),
      allowNull: false,
      field: "new_status"
    },

    author: {
      type: DataTypes.STRING(200),
      allowNull: false
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    changedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "changed_at"
    }
  },
  {
    tableName: "request_status_history",
    timestamps: false
  }
);

export default RequestStatusHistory;