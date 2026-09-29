import { Sequelize } from "sequelize";
import config from "./config.js";

const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPassword,
  {
    host: config.dbHost,
    port: config.dbPort,
    dialect: "postgres",
    logging: false,

    pool: {
      min: config.dbPoolMin,
      max: config.dbPoolMax
    }
  }
);

export default sequelize;