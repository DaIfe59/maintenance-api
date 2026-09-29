import { DataTypes } from "sequelize";
import sequelize from "../src/config/database.js";

const Site = sequelize.define(
  "Site",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },

    region: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },

    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  },
  {
    tableName: "sites",
    timestamps: true
  }
);

export default Site;