const Level = require("../models/level.model");

// Helper function for error handling
const handleErrorResponse = (res, error, status = 500) => {
  console.error(error); // For debugging
  res
    .status(status)
    .json({ success: false, error: { message: error.message } });
};

// Add a new level
exports.addLevel = async (req, res) => {
  try {
    const newLevel = new Level(req.body);
    const savedLevel = await newLevel.save();
    res.status(201).json({ success: true, data: savedLevel });
  } catch (error) {
    handleErrorResponse(res, error, 400);
  }
};

// Get all levels
exports.getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find().populate("lessons");
    res.status(200).json({ success: true, data: levels });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Get a single level by ID
exports.getLevelById = async (req, res) => {
  try {
    const level = await Level.findById(req.params.id).populate("lessons");
    if (!level) {
      return handleErrorResponse(res, new Error("Level not found"), 404);
    }
    res.status(200).json({ success: true, data: level });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Get all lessons by level ID
exports.getAllLessonsByLevelId = async (req, res) => {
  try {
    const level = await Level.findById(req.params.id).populate({
      path: "lessons",
      populate: { path: "vocabularies kanjis grammars questions" }, // Deep population if needed
    });
    if (!level) {
      return handleErrorResponse(res, new Error("Level not found"), 404);
    }
    res.status(200).json({ success: true, data: level.lessons });
  } catch (error) {
    handleErrorResponse(res, error);
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
    if (!updatedLevel) {
      return handleErrorResponse(res, new Error("Level not found"), 404);
    }
    res.status(200).json({ success: true, data: updatedLevel });
  } catch (error) {
    handleErrorResponse(res, error, 400);
  }
};

// Delete a level by ID
exports.deleteLevel = async (req, res) => {
  try {
    const deletedLevel = await Level.findByIdAndDelete(req.params.id);
    if (!deletedLevel) {
      return handleErrorResponse(res, new Error("Level not found"), 404);
    }
    res.status(200).json({
      success: true,
      data: { message: "Level successfully deleted" },
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
