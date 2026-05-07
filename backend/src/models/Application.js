const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["saved", "applied", "interview", "rejected"],
      default: "saved",
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    generatedContent: {
      coverLetter: String,
      resumeSummary: String,
      hrAnswers: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
