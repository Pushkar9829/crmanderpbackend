const express = require("express");
const deliverableController = require("../controllers/deliverable.controller");
const { requireManager } = require("../middleware/auth");

const router = express.Router();

router.get("/", deliverableController.list);
router.post("/", requireManager, deliverableController.create);
router.put("/:id", requireManager, deliverableController.update);
router.delete("/:id", requireManager, deliverableController.remove);

module.exports = router;
