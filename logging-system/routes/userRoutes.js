const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { register, login, logout } = require("../controllers/userController");

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

// PROFILE
router.get("/profile", authMiddleware, (req, res) => {
  res.json(req.developer);
});

module.exports = router;
