const express = require("express");
const employeeController = require("../controllers/employee.controller");
const { requireManager } = require("../middleware/auth");

const router = express.Router();

router.get("/", employeeController.list);
router.get("/active", employeeController.listActive);
router.get("/:id", employeeController.getById);
router.post("/", requireManager, employeeController.create);
router.post("/assign", requireManager, employeeController.assign);
router.delete("/assign/:id", requireManager, employeeController.unassign);

module.exports = router;
