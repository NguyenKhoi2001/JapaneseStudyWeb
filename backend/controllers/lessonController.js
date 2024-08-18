const Lesson = require("../models/lesson.model");
const Level = require("../models/level.model");
const Question = require("../models/question.model");
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
      "vocabularies kanjis grammars questions"
    );
    res.status(200).json({ success: true, data: lessons });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Method to get all learning resources by lesson ID
exports.getLearningResourceByLesson = async (req, res) => {
  try {
    const { id } = req.params; // Get the lesson ID from the request parameters
    const lesson = await Lesson.findById(id).populate({
      path: "vocabularies kanjis grammars questions",
    });
    if (!lesson) {
      return handleErrorResponse(res, new Error("Lesson not found"), 404);
    }
    res.status(200).json({ success: true, data: lesson });
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
    ).populate("vocabularies kanjis grammars questions");
    if (!updatedLesson) {
      return handleErrorResponse(res, new Error("Lesson not found"), 404);
    }
    res.status(200).json({ success: true, data: updatedLesson });
  } catch (error) {
    handleErrorResponse(res, error, 400);
  }
};
exports.modifyLessonItems = async (req, res) => {
  const { id: lessonId } = req.params;
  const { add, remove } = req.body;

  // Early exit if no modification instructions are provided
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

    // Handle additions
    if (add) {
      for (const [key, idsToAdd] of Object.entries(add)) {
        idsToAdd.forEach(async (id) => {
          if (!lesson[key].includes(id)) {
            lesson[key].push(id);
            if (key === "questions") {
              await Question.findByIdAndUpdate(id, {
                $addToSet: { lessons: lessonId },
              });
            }
          }
        });
      }
    }

    if (remove) {
      for (const [key, idsToRemove] of Object.entries(remove)) {
        lesson[key] = lesson[key].filter(
          (id) => !idsToRemove.includes(id.toString())
        );
        if (key === "questions") {
          idsToRemove.forEach(async (id) => {
            await Question.findByIdAndUpdate(id, {
              $pull: { lessons: lessonId },
            });
          });
        }
      }
    }

    // Save the updated lesson
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
    await Question.updateMany({ lessons: id }, { $pull: { lessons: id } });

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
