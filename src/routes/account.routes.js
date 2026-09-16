const express = require("express");
const accountController = require("../controllers/account.controller");
const { requireManager } = require("../middleware/auth");

const router = express.Router();

router.get("/", accountController.list);
router.get("/export", accountController.exportCsv);
router.post("/", requireManager, accountController.create);
router.delete("/:id", requireManager, accountController.remove);

module.exports = router;
