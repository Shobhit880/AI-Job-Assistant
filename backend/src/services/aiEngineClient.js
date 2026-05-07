const axios = require("axios");
const env = require("../config/env");

const client = axios.create({
  baseURL: env.aiEngineUrl,
  timeout: 15000,
});

async function parseResume(payload) {
  const { data } = await client.post("/parse-resume", payload);
  return data;
}

async function matchJobs(payload) {
  const { data } = await client.post("/match-jobs", payload);
  return data;
}

async function generateContent(payload) {
  const { data } = await client.post("/generate-content", payload);
  return data;
}

async function atsScore(payload) {
  const { data } = await client.post("/ats-score", payload);
  return data;
}

module.exports = {
  parseResume,
  matchJobs,
  generateContent,
  atsScore,
};
