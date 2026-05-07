const fs = require("fs");
const path = require("path");
const { connectDb, disconnectDb } = require("../db/mongoose");
const Job = require("../models/Job");
const env = require("../config/env");

async function seed() {
  if (env.useInMemoryDb) {
    console.log("Skipping seed because no-database dev mode already bootstraps sample jobs.");
    return;
  }

  console.log(`Connecting to MongoDB for seeding${env.useInMemoryDb ? " (in-memory mode)" : ""}...`);
  await connectDb();
  const filePath = path.join(__dirname, "../../../database/seed/sampleJobs.json");
  const jobs = JSON.parse(fs.readFileSync(filePath, "utf8"));

  await Job.deleteMany({});
  await Job.insertMany(jobs);
  console.log(`Seeded ${jobs.length} jobs`);
  await disconnectDb();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await disconnectDb();
  process.exit(1);
});
