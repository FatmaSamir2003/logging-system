const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createApp,
  getApps,
  getSingleApp,
  deleteApp,
  postLog,
  getLogs,
  getStats,
} = require("../controllers/appController");

// routes for applications
router.post("/", authMiddleware, createApp);
router.get("/", authMiddleware, getApps);
router.delete("/:name", authMiddleware, deleteApp);

// routes for logs
router.post("/:name/logs", postLog);
router.get("/:name/logs", authMiddleware, getLogs);

// route for statistics
router.get("/:name/stats", authMiddleware, getStats);

// route for fetching a single application by name
router.get("/:name", authMiddleware, getSingleApp);

module.exports = router;
