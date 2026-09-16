const express = require("express");
const clientController = require("../controllers/client.controller");
const { requireManager } = require("../middleware/auth");

const router = express.Router();

router.get("/", clientController.list);
router.post("/", requireManager, clientController.create);

module.exports = router;
