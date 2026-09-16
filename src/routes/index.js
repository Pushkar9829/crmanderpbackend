const express = require("express");
const { requireAuth } = require("../middleware/auth");
const authRoutes = require("./auth.routes");
const clientRoutes = require("./client.routes");
const projectRoutes = require("./project.routes");
const deliverableRoutes = require("./deliverable.routes");
const employeeRoutes = require("./employee.routes");
const hoursRoutes = require("./hours.routes");
const accountRoutes = require("./account.routes");
const dashboardRoutes = require("./dashboard.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/clients", requireAuth, clientRoutes);
router.use("/projects", requireAuth, projectRoutes);
router.use("/deliverables", requireAuth, deliverableRoutes);
router.use("/employees", requireAuth, employeeRoutes);
router.use("/hours", requireAuth, hoursRoutes);
router.use("/accounts", requireAuth, accountRoutes);
router.use("/dashboard", requireAuth, dashboardRoutes);

module.exports = router;
