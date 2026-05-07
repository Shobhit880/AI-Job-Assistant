const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const env = require("../config/env");

let memoryServer;

async function connectDb(uri = env.mongodbUri) {
  mongoose.set("strictQuery", true);

  if (env.useInMemoryDb) {
    if (!memoryServer) {
      memoryServer = await MongoMemoryServer.create();
    }

    await mongoose.connect(memoryServer.getUri(), {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    return;
  }

  if (!uri) {
    throw new Error("MONGODB_URI is missing in backend/.env");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });
}

async function disconnectDb() {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

module.exports = {
  connectDb,
  disconnectDb,
};
