const Application = require("../models/Application");
const Log = require("../models/Log");

// ==========================================
// (Create Application)
// ==========================================
const createApp = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Application name is required" });

    if (/\s/.test(name)) {
      return res
        .status(400)
        .json({ message: "Whitespaces are not allowed in name" });
    }

    const app = await Application.create({
      name,
      developer: req.developer._id,
    });

    res.status(201).json({ message: "Application created successfully", app });
  } catch (error) {
    res.status(400).json({ message: "Application name must be unique" });
  }
};

// ==========================================
// (Get User Applications)
// ==========================================
const getApps = async (req, res) => {
  try {
    const apps = await Application.find({ developer: req.developer._id });
    res.json({ message: "Your applications", apps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// (Delete Application)
// ==========================================
const deleteApp = async (req, res) => {
  try {
    const { name } = req.params;
    const app = await Application.findOne({
      name,
      developer: req.developer._id,
    });

    if (!app) return res.status(404).json({ message: "Application not found" });

    await Application.deleteOne({ _id: app._id });
    await Log.deleteMany({ application: app._id });

    res.json({ message: "Application and its logs deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// SDK (Post Log)
// ==========================================
const postLog = async (req, res) => {
  try {
    const { name } = req.params;
    const { message, level } = req.body;
    const apiKey = req.headers["x-api-key"];

    const app = await Application.findOne({ name }).populate("developer");

    if (!app || app.developer.apiKey !== apiKey) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid API Key or App Name" });
    }

    let log = await Log.findOne({
      message,
      level: level.toUpperCase(),
      application: app._id,
    });

    if (log) {
      log.count += 1;
      await log.save();
    } else {
      log = await Log.create({
        message,
        level: level.toUpperCase(),
        application: app._id,
      });
    }

    res.status(201).json({ message: "Log saved successfully", log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// (Search, Filter, Sort, Paginate)
// ==========================================
const getLogs = async (req, res) => {
  try {
    const { name } = req.params;
    const {
      page = 1,
      limit = 10,
      level,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    const app = await Application.findOne({ name });
    if (!app) return res.status(404).json({ message: "Application not found" });

    let filter = { application: app._id };
    if (level) filter.level = level.toUpperCase();
    if (search) filter.message = { $regex: search, $options: "i" };

    const logs = await Log.find(filter)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .limit(Number(limit))
      .skip((page - 1) * Number(limit));

    const total = await Log.countDocuments(filter);

    res.json({ total, page: Number(page), logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ( Charts)
// ==========================================
const getStats = async (req, res) => {
  try {
    const { name } = req.params;
    const app = await Application.findOne({ name });
    if (!app) return res.status(404).json({ message: "App not found" });

    const stats = await Log.aggregate([
      { $match: { application: app._id } },
      { $group: { _id: "$level", value: { $sum: "$count" } } },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
//(Get Single Application)
// ==========================================
const getSingleApp = async (req, res) => {
  try {
    const { name } = req.params;
    const app = await Application.findOne({
      name,
      developer: req.developer._id,
    });

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createApp,
  getApps,
  getSingleApp,
  deleteApp,
  postLog,
  getLogs,
  getStats,
};
