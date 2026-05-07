process.env.USE_IN_MEMORY_DB = "false";

jest.mock("../src/services/aiEngineClient", () => ({
  parseResume: jest.fn(async () => ({
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1-555-0100",
    skills: ["Node.js", "Flutter", "MongoDB"],
    education: [{ institution: "State University", degree: "B.Tech", year: "2022" }],
    projects: [{ name: "Talent Tracker", description: "Hiring assistant", technologies: ["Node.js", "React"] }],
    experience: [{ company: "Acme", title: "Software Engineer", startDate: "2022", endDate: "Present", highlights: ["Built APIs"] }],
    resumeSummary: "Full-stack engineer with strong API and mobile experience.",
    suggestions: ["Add quantified impact metrics"],
  })),
  matchJobs: jest.fn(async ({ jobs }) => ({
    matches: jobs.map((job, index) => ({
      jobId: job.id,
      score: 88 - index,
      reason: "High skill overlap",
      breakdown: {
        skillMatch: 40,
        keywordMatch: 28,
        experienceMatch: 20,
      },
    })),
  })),
  generateContent: jest.fn(async () => ({
    coverLetter: "Cover letter content",
    resumeSummary: "Tailored summary",
    hrAnswers: ["Answer 1", "Answer 2"],
    matchScore: 88,
  })),
  atsScore: jest.fn(async () => ({
    score: 84,
    suggestions: ["Add leadership keywords", "Use more measurable outcomes"],
  })),
}));
