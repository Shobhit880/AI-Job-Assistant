const fs = require("fs");
const path = require("path");
const Job = require("../models/Job");

async function bootstrapSampleJobs() {
  const existingJobs = await Job.countDocuments();
  if (existingJobs > 0) {
    return 0;
  }

  const filePath = path.join(__dirname, "../../../database/seed/sampleJobs.json");
  const jobs = JSON.parse(fs.readFileSync(filePath, "utf8"));
  await Job.insertMany(jobs);
  return jobs.length;
}

module.exports = {
  bootstrapSampleJobs,
};
