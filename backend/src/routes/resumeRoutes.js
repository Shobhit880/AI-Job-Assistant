const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");
const { parseResume } = require("../controllers/resumeController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  "/parse",
  upload.single("resume"),
  [body("userId").optional().isString(), body("targetRole").optional().isString()],
  parseResume
);

module.exports = router;
