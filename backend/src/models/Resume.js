const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    company: String,
    title: String,
    startDate: String,
    endDate: String,
    highlights: [String],
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    institution: String,
    degree: String,
    year: String,
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    technologies: [String],
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    parsedData: {
      name: String,
      email: String,
      phone: String,
      skills: [String],
      education: [educationSchema],
      projects: [projectSchema],
      experience: [experienceSchema],
      resumeSummary: String,
      suggestions: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
