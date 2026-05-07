const { validationResult } = require("express-validator");
const resumeService = require("../services/resumeService");
const aiEngineClient = require("../services/aiEngineClient");

async function parseResume(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required" });
    }

    const userId = req.body.userId || "demo-user";
    const resume = await resumeService.parseResumeFile({
      userId,
      file: req.file,
    });

    const ats = await aiEngineClient.atsScore({
      resume: resume.parsedData,
      targetRole: req.body.targetRole || "Software Engineer",
    });

    return res.status(201).json({
      message: "Resume parsed successfully",
      resume,
      ats,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  parseResume,
};
