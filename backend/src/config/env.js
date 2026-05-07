const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/job_assistant",
  useInMemoryDb: process.env.USE_IN_MEMORY_DB === "true",
  aiEngineUrl: process.env.AI_ENGINE_URL || "http://localhost:8001",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};
