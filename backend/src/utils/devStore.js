const fs = require("fs");
const path = require("path");

const jobsPath = path.join(__dirname, "../../../database/seed/sampleJobs.json");
const sampleJobs = JSON.parse(fs.readFileSync(jobsPath, "utf8")).map((job, index) => ({
  ...job,
  _id: `job-${index + 1}`,
}));

const state = {
  resumes: {},
  applications: [],
  jobs: sampleJobs,
};

function saveResume(userId, resume) {
  state.resumes[userId] = {
    _id: `resume-${userId}`,
    userId,
    originalFileName: resume.originalFileName,
    parsedData: resume.parsedData,
    createdAt: new Date(),
  };
  return state.resumes[userId];
}

function getResume(userId) {
  return state.resumes[userId] || null;
}

function getJobs() {
  return state.jobs;
}

function upsertApplication(application) {
  const existingIndex = state.applications.findIndex(
    (item) => item.userId === application.userId && item.jobId === application.jobId
  );

  if (existingIndex >= 0) {
    state.applications[existingIndex] = {
      ...state.applications[existingIndex],
      ...application,
      updatedAt: new Date(),
    };
    return state.applications[existingIndex];
  }

  const next = {
    _id: `application-${state.applications.length + 1}`,
    ...application,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  state.applications.push(next);
  return next;
}

function getApplications(userId) {
  return state.applications.filter((item) => item.userId === userId);
}

module.exports = {
  saveResume,
  getResume,
  getJobs,
  upsertApplication,
  getApplications,
};
