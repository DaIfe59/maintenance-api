import { DataTypes } from "sequelize";
import sequelize from "../src/config/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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

    refreshTokenHash: {
        type: DataTypes.STRING(64),
        allowNull: true
      },
    
    technicianId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "technicians",
        key: "id"
      }
    },

    role: {
      type: DataTypes.ENUM(
        "viewer",
        "technician",
        "admin"
      ),
      allowNull: false,
      defaultValue: "viewer"
    }
    
  },
  {
    tableName: "users",
    timestamps: true
  }
);

export default User;
