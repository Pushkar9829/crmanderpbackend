const express = require("express");
const hoursController = require("../controllers/hours.controller");
const { requireManager } = require("../middleware/auth");

const router = express.Router();

router.get("/works", hoursController.listWorks);
router.post("/works", requireManager, hoursController.createWork);
router.post("/time", hoursController.logTime);
router.get("/summary", hoursController.summary);

module.exports = router;
