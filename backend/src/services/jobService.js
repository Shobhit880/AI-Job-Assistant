const Job = require("../models/Job");
const Application = require("../models/Application");
const env = require("../config/env");
const aiEngineClient = require("./aiEngineClient");
const { normalizeText } = require("../utils/text");
const devStore = require("../utils/devStore");

function buildJobQuery({ role, location, skills = [] }) {
  const query = {};

  if (role) {
    query.title = { $regex: role, $options: "i" };
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (skills.length > 0) {
    query.skills = { $in: skills.map((skill) => new RegExp(`^${skill}$`, "i")) };
  }

  return query;
}

async function fetchRelevantJobs({ filters, resume }) {
  let jobs;

  if (env.useInMemoryDb) {
    jobs = devStore.getJobs().filter((job) => {
      if (filters.role && !job.title.toLowerCase().includes(filters.role.toLowerCase())) {
        return false;
      }
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.skills?.length) {
        const wanted = filters.skills.map((skill) => skill.toLowerCase());
        if (!job.skills.some((skill) => wanted.includes(skill.toLowerCase()))) {
          return false;
        }
      }
      return true;
    });
  } else {
    jobs = await Job.find(buildJobQuery(filters)).sort({ postedAt: -1 }).limit(20);
  }

  const aiMatch = await aiEngineClient.matchJobs({
    resume: resume.parsedData,
    jobs: jobs.map((job) => ({
      id: job._id.toString(),
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      skills: job.skills,
      minYearsExperience: job.minYearsExperience,
    })),
  });

  return jobs.map((job) => {
    const scoreCard = aiMatch.matches.find((item) => item.jobId === job._id.toString());
    return {
      ...(typeof job.toObject === "function" ? job.toObject() : job),
      relevanceReason: scoreCard?.reason || `Matched on ${normalizeText(job.title)}`,
      matchScore: scoreCard?.score || 0,
      breakdown: scoreCard?.breakdown || {
        skillMatch: 0,
        keywordMatch: 0,
        experienceMatch: 0,
      },
    };
  });
}

async function getDashboard(userId) {
  let applications;

  if (env.useInMemoryDb) {
    applications = devStore.getApplications(userId).map((item) => ({
      ...item,
      jobId: devStore.getJobs().find((job) => job._id === item.jobId),
    }));
  } else {
    applications = await Application.find({ userId }).populate("jobId").sort({ updatedAt: -1 });
  }

  return {
    recommendedJobs: applications.filter((item) => item.status === "saved"),
    appliedJobs: applications.filter((item) => item.status === "applied"),
    trackedJobs: applications,
  };
}

module.exports = {
  fetchRelevantJobs,
  getDashboard,
};
