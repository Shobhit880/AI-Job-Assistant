const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");
const env = require("../config/env");
const aiEngineClient = require("./aiEngineClient");
const devStore = require("../utils/devStore");

async function parseResumeFile({ userId, file }) {
  let extractedText = "";

  try {
    const pdfData = await pdfParse(file.buffer);
    extractedText = pdfData.text;
  } catch (error) {
    // Fallback keeps testability and supports simple text-based PDFs or fixtures.
    extractedText = file.buffer.toString("utf8");
  }

  const parsed = await aiEngineClient.parseResume({
    text: extractedText,
    fileName: file.originalname,
  });

  if (env.useInMemoryDb) {
    return devStore.saveResume(userId, {
      originalFileName: file.originalname,
      parsedData: parsed,
    });
  }

  const resume = await Resume.create({
    userId,
    originalFileName: file.originalname,
    parsedData: parsed,
  });

  return resume;
}

async function getLatestResume(userId) {
  if (env.useInMemoryDb) {
    return devStore.getResume(userId);
  }

  return Resume.findOne({ userId }).sort({ createdAt: -1 });
}

module.exports = {
  parseResumeFile,
  getLatestResume,
};
