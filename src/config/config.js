const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(".env") });

const config = {
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  port: process.env.PORT || 3000,
  nodeEnv: process.NODE_ENV || "development",
};

module.exports = config;
