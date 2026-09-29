import { DataTypes } from "sequelize";
import sequelize from "../src/config/database.js";

const Technician = sequelize.define(
  "Technician",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },

    fullName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "full_name"
    },

    specialization: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    employeeNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: "employee_number"
    }
  },
  {
    tableName: "technicians",
    timestamps: true
  }
);

export default Technician;