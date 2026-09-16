const express = require("express");
const projectController = require("../controllers/project.controller");
const { requireManager } = require("../middleware/auth");

const router = express.Router();

router.get("/", projectController.list);
router.get("/lite", projectController.listLite);
router.get("/:id", projectController.getById);
router.post("/", requireManager, projectController.create);
router.put("/:id", requireManager, projectController.update);
router.delete("/:id", requireManager, projectController.remove);

module.exports = router;
