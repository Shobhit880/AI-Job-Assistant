const express = require("express");
const { query } = require("express-validator");
const { getRecommendations } = require("../controllers/jobController");

const router = express.Router();

router.get(
  "/recommendations",
  [query("userId").optional().isString(), query("role").optional().isString(), query("location").optional().isString()],
  getRecommendations
);

module.exports = router;
