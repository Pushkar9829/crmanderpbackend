const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", dashboardController.dashboard);
router.get("/settings", dashboardController.getSettings);
router.put("/settings", requireAdmin, dashboardController.saveSettings);

module.exports = router;
