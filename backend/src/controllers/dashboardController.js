const jobService = require("../services/jobService");

async function getDashboard(req, res, next) {
  try {
    const userId = req.query.userId || "demo-user";
    const dashboard = await jobService.getDashboard(userId);
    return res.json(dashboard);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDashboard,
};
