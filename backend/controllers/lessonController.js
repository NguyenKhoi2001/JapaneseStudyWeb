const Lesson = require("../models/lesson.model");
const Level = require("../models/level.model");
const UserProgress = require("../models/userProgress.model");

// Helper function for error handling
const handleErrorResponse = (res, error, status = 500) => {
  console.error(error); // For debugging
  res
    .status(status)
    .json({ success: false, error: { message: error.message } });
};

// Add a new lesson
exports.addLesson = async (req, res) => {
  try {
    const newLesson = new Lesson(req.body);
    const savedLesson = await newLesson.save();
    res.status(201).json({ success: true, data: savedLesson }); // Directly return the saved lesson
  } catch (error) {
    handleErrorResponse(res, error, 400);
  }
};

// Get all lessons
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().populate(
      "vocabularies kanjis grammars"
    );
    res.status(200).json({ success: true, data: lessons });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Get a single lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate(
      "vocabularies kanjis grammars"
    );
    if (!lesson) {
      return handleErrorResponse(res, new Error("Lesson not found"), 404);
    }
    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Update a lesson
exports.updateLesson = async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("vocabularies kanjis grammars");
    if (!updatedLesson) {
      return handleErrorResponse(res, new Error("Lesson not found"), 404);
    }
    res.status(200).json({ success: true, data: updatedLesson });
  } catch (error) {
    handleErrorResponse(res, error, 400);
  }
};

// Modify lesson items
exports.modifyLessonItems = async (req, res) => {
  const lessonId = req.params.id;
  const { add, remove } = req.body;

  if (!add && !remove) {
    return handleErrorResponse(
      res,
      new Error("No add or remove items specified"),
      400
    );
  }

  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return handleErrorResponse(res, new Error("Lesson not found"), 404);
    }

    // Add items
    if (add) {
      Object.entries(add).forEach(([key, value]) => {
        lesson[key].push(...value);
      });
    }

    // Remove items
    if (remove) {
      Object.entries(remove).forEach(([key, value]) => {
        lesson[key] = lesson[key].filter(
          (id) => !value.includes(id.toString())
        );
      });
    }

    const updatedLesson = await lesson.save();
    res.status(200).json({ success: true, data: updatedLesson });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Delete a lesson
exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    await Lesson.findByIdAndDelete(id);
    await UserProgress.deleteMany({ lesson: id });
    await Level.updateMany({}, { $pull: { lessons: id } });

    res.status(200).json({
      success: true,
      data: {
        message: "Lesson successfully deleted and references removed.",
      },
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
