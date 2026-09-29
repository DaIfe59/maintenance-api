require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",

    pool: {
      min: Number(process.env.DB_POOL_MIN || 0),
      max: Number(process.env.DB_POOL_MAX || 10)
    }
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",

    pool: {
      min: Number(process.env.DB_POOL_MIN || 0),
      max: Number(process.env.DB_POOL_MAX || 10)
    }
  }
};