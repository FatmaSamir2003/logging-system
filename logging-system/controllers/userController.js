const Developer = require("../models/Developer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { v4: uuidv4 } = require("uuid");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // check email exists
    const existingDeveloper = await Developer.findOne({ email });

    if (existingDeveloper) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate api key
    const apiKey = uuidv4();

    // create developer
    const developer = await Developer.create({
      username,
      email,
      password: hashedPassword,
      apiKey,
    });

    res.status(201).json({
      message: "Developer registered successfully",
      developer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// ==========================================
// 2. LOGIN (تسجيل الدخول)
// ==========================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // check developer exists
    const developer = await Developer.findOne({ email });

    if (!developer) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, developer.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: developer._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      developer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// 3. LOGOUT (تسجيل الخروج)
// ==========================================
const logout = async (req, res) => {
  res.json({
    message: "Logged out successfully",
  });
};

module.exports = {
  register,
  login,
  logout,
};
