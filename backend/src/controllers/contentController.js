const { validationResult } = require("express-validator");
const Job = require("../models/Job");
const Application = require("../models/Application");
const env = require("../config/env");
const resumeService = require("../services/resumeService");
const contentService = require("../services/contentService");
const devStore = require("../utils/devStore");

async function generateContent(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.body.userId || "demo-user";
    const resume = await resumeService.getLatestResume(userId);
    const job = env.useInMemoryDb
      ? devStore.getJobs().find((item) => item._id === req.body.jobId)
      : await Job.findById(req.body.jobId);

    if (!resume || !job) {
      return res.status(404).json({ message: "Resume or job not found" });
    }

    const rawJob = typeof job.toObject === "function" ? job.toObject() : job;
    const generated = await contentService.generateApplicationContent({
      resume,
      job: {
        ...rawJob,
        id: rawJob.id || rawJob._id?.toString(),
      },
    });

    const applicationPayload = {
      userId,
      jobId: job._id,
      status: req.body.status || "saved",
      generatedContent: generated,
      matchScore: req.body.matchScore || generated.matchScore || 0,
    };
    const application = env.useInMemoryDb
      ? devStore.upsertApplication(applicationPayload)
      : await Application.findOneAndUpdate({ userId, jobId: job._id }, applicationPayload, {
          new: true,
          upsert: true,
        });

    return res.json({
      application,
      generated,
    });
  } catch (error) {
    return next(error);
  }
}

async function generateAutofill(req, res, next) {
  try {
    const userId = req.body.userId || "demo-user";
    const resume = await resumeService.getLatestResume(userId);

    if (!resume) {
      return res.status(404).json({ message: "No parsed resume found for user" });
    }

    const answers = req.body.answers || [
      "I am excited about this opportunity because it aligns with my product-focused engineering experience.",
      "My strongest value is building reliable systems that improve user outcomes.",
    ];

    return res.json({
      name: resume.parsedData.name,
      email: resume.parsedData.email,
      phone: resume.parsedData.phone,
      skills: resume.parsedData.skills,
      experience: resume.parsedData.experience,
      answers,
      safeMode: true,
      submitEnabled: false,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  generateContent,
  generateAutofill,
};
