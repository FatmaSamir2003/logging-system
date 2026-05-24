const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// استدعاء الدوال من الـ Controller الجديد
const {
  createApp,
  getApps,
  getSingleApp,
  deleteApp,
  postLog,
  getLogs,
  getStats,
} = require("../controllers/appController");

// روابط التطبيقات
router.post("/", authMiddleware, createApp);
router.get("/", authMiddleware, getApps);
router.delete("/:name", authMiddleware, deleteApp);

// روابط اللوجات
router.post("/:name/logs", postLog);
router.get("/:name/logs", authMiddleware, getLogs);

// رابط الإحصائيات (الـ Bonus)
router.get("/:name/stats", authMiddleware, getStats);

// جلب بيانات تطبيق واحد بالاسم
router.get("/:name", authMiddleware, getSingleApp);

module.exports = router;
