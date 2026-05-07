require("./setup");

const path = require("path");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const { connectDb, disconnectDb } = require("../src/db/mongoose");
const Job = require("../src/models/Job");

let mongoServer;

jest.setTimeout(20000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDb(mongoServer.getUri());
});

afterAll(async () => {
  await disconnectDb();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
});

test("GET /api/health returns ok", async () => {
  const response = await request(app).get("/api/health");
  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe("ok");
});

test("POST /api/resumes/parse parses resume and returns ATS score", async () => {
  const pdfPath = path.join(__dirname, "fixtures", "sample-resume.pdf");
  const response = await request(app)
    .post("/api/resumes/parse")
    .field("userId", "demo-user")
    .attach("resume", pdfPath);

  expect(response.statusCode).toBe(201);
  expect(response.body.resume.parsedData.name).toBe("Alex Johnson");
  expect(response.body.ats.score).toBe(84);
});

test("GET /api/jobs/recommendations returns ranked jobs", async () => {
  await Job.insertMany([
    {
      externalId: "job-1",
      title: "Senior Full Stack Engineer",
      company: "Nova",
      location: "Remote",
      description: "Node.js Flutter MongoDB APIs",
      skills: ["Node.js", "Flutter", "MongoDB"],
      minYearsExperience: 3,
      postedAt: new Date(),
    },
  ]);

  const Resume = require("../src/models/Resume");
  await Resume.create({
    userId: "demo-user",
    originalFileName: "resume.pdf",
    parsedData: {
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "+1-555-0100",
      skills: ["Node.js", "Flutter", "MongoDB"],
      education: [],
      projects: [],
      experience: [],
    },
  });

  const response = await request(app).get("/api/jobs/recommendations").query({ userId: "demo-user" });

  expect(response.statusCode).toBe(200);
  expect(response.body.jobs).toHaveLength(1);
  expect(response.body.jobs[0].matchScore).toBe(88);
});
