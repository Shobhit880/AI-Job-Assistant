const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      default: "Full-time",
    },
    description: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    minYearsExperience: {
      type: Number,
      default: 0,
    },
    sourceUrl: String,
    postedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
