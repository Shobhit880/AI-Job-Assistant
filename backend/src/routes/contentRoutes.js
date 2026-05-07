const express = require("express");
const { body } = require("express-validator");
const { generateContent, generateAutofill } = require("../controllers/contentController");

const router = express.Router();

router.post(
  "/generate",
  [body("jobId").isString(), body("userId").optional().isString(), body("status").optional().isString()],
  generateContent
);

router.post("/autofill", [body("userId").optional().isString()], generateAutofill);

module.exports = router;
