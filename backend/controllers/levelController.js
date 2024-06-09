const Level = require("../models/level.model");

// Add a new level
exports.addLevel = async (req, res) => {
  try {
    const newLevel = new Level(req.body);
    const savedLevel = await newLevel.save();
    res.status(201).json({ success: true, data: savedLevel });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

// Get all levels
exports.getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find().populate("lessons");
    res.status(200).json({ success: true, data: levels });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// Get a single level by ID
exports.getLevelById = async (req, res) => {
  try {
    const level = await Level.findById(req.params.id).populate("lessons");
    if (level) {
      res.status(200).json({ success: true, data: level });
    } else {
      res
        .status(404)
        .json({ success: false, error: { message: "Level not found" } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// Update a level by ID
exports.updateLevel = async (req, res) => {
  try {
    const updatedLevel = await Level.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("lessons");
    if (updatedLevel) {
      res.status(200).json({ success: true, data: updatedLevel });
    } else {
      res
        .status(404)
        .json({ success: false, error: { message: "Level not found" } });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

// Delete a level by ID
exports.deleteLevel = async (req, res) => {
  try {
    const deletedLevel = await Level.findByIdAndDelete(req.params.id);
    if (deletedLevel) {
      res.status(200).json({
        success: true,
        data: { message: "Level successfully deleted" },
      });
    } else {
      res
        .status(404)
        .json({ success: false, error: { message: "Level not found" } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
