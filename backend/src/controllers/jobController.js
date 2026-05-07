const { validationResult } = require("express-validator");
const resumeService = require("../services/resumeService");
const jobService = require("../services/jobService");

async function getRecommendations(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.query.userId || "demo-user";
    const resume = await resumeService.getLatestResume(userId);

    if (!resume) {
      return res.status(404).json({ message: "No parsed resume found for user" });
    }

    const jobs = await jobService.fetchRelevantJobs({
      filters: {
        role: req.query.role,
        location: req.query.location,
        skills: req.query.skills ? req.query.skills.split(",") : resume.parsedData.skills,
      },
      resume,
    });

    return res.json({ jobs });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getRecommendations,
};
