const aiEngineClient = require("./aiEngineClient");

async function generateApplicationContent({ resume, job }) {
  return aiEngineClient.generateContent({
    resume: resume.parsedData,
    job,
  });
}

module.exports = {
  generateApplicationContent,
};
