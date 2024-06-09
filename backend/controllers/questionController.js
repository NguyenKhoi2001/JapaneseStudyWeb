const Question = require("../models/question.model");
const Lesson = require("../models/lesson.model");
const Level = require("../models/level.model");

// Helper function for error handling
const handleError = (res, error, statusCode = 500) => {
  console.log(error); // Consider logging for debugging purposes
  res.status(statusCode).json({
    success: false,
    error: { message: error.message },
  });
};

// Add a new question
exports.addQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    const savedQuestion = await question.save();
    res.status(201).json({
      success: true,
      data: savedQuestion,
    });
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get a single question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return handleError(res, new Error("Question not found"), 404);
    }
    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update a question by ID
exports.updateQuestion = async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedQuestion) {
      return handleError(res, new Error("Question not found"), 404);
    }
    res.status(200).json({
      success: true,
      data: updatedQuestion,
    });
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a question by ID
exports.deleteQuestion = async (req, res) => {
  try {
    const deletionResult = await Question.findByIdAndDelete(req.params.id);
    if (!deletionResult) {
      return handleError(res, new Error("Question not found"), 404);
    }
    await Lesson.updateMany({}, { $pull: { questions: req.params.id } });
    res.status(200).json({
      success: true,
      data: {
        message:
          "Question successfully deleted and references removed from lessons.",
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all questions from a specific lesson
exports.getAllQuestionsFromLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("questions");
    if (!lesson) {
      return handleError(res, new Error("Lesson not found"), 404);
    }
    res.status(200).json({
      success: true,
      data: lesson.questions,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all questions from a specific level
exports.getAllQuestionsFromLevel = async (req, res) => {
  try {
    const level = await Level.findById(req.params.id).populate({
      path: "lessons",
      populate: { path: "questions" },
    });
    if (!level) {
      return handleError(res, new Error("Level not found"), 404);
    }

    const questions = level.lessons.flatMap((lesson) => lesson.questions);
    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Fetch custom questions from a specific lesson
exports.getCustomQuestionsFromLesson = async (req, res) => {
  const { lessonId } = req.params;
  const { total, hard = 0, medium = 0, easy = 0 } = req.query;

  try {
    const lesson = await Lesson.findById(lessonId).populate("questions");
    if (!lesson) return handleError(res, new Error("Lesson not found"), 404);

    let allQuestions = lesson.questions.map((q) => q._id.toString());
    let questions = [];
    let fetchedIds = [];

    const fetchQuestions = async (difficulty, count) => {
      return Question.find({
        _id: { $in: allQuestions, $nin: fetchedIds },
        difficulty: difficulty,
      })
        .limit(count)
        .lean();
    };

    for (let [difficulty, count] of Object.entries({
      Hard: hard,
      Medium: medium,
      Easy: easy,
    })) {
      let fetched = await fetchQuestions(difficulty, parseInt(count));
      questions.push(...fetched);
      fetchedIds.push(...fetched.map((q) => q._id.toString()));
    }

    const remaining = Math.max(0, total - questions.length);
    if (remaining > 0) {
      let additionalQuestions = await Question.find({
        _id: { $nin: fetchedIds },
      })
        .limit(remaining)
        .lean();
      questions.push(...additionalQuestions);
    }

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Fetch custom questions from a specific level
exports.getCustomQuestionsFromLevel = async (req, res) => {
  const { levelId } = req.params;
  const { total, hard = 0, medium = 0, easy = 0 } = req.query;

  try {
    const level = await Level.findById(levelId).populate({
      path: "lessons",
      populate: { path: "questions" },
    });
    if (!level) return handleError(res, new Error("Level not found"), 404);

    let allQuestions = level.lessons.flatMap((lesson) =>
      lesson.questions.map((q) => q._id.toString())
    );
    let questions = [];
    let fetchedIds = [];

    const fetchQuestions = async (difficulty, count) => {
      return Question.find({
        _id: { $in: allQuestions, $nin: fetchedIds },
        difficulty: difficulty,
      })
        .limit(count)
        .lean();
    };

    for (let [difficulty, count] of Object.entries({
      Hard: hard,
      Medium: medium,
      Easy: easy,
    })) {
      let fetched = await fetchQuestions(difficulty, parseInt(count));
      questions.push(...fetched);
      fetchedIds.push(...fetched.map((q) => q._id.toString()));
    }

    const remaining = Math.max(0, total - questions.length);
    if (remaining > 0) {
      let additionalQuestions = await Question.find({
        _id: { $nin: fetchedIds },
      })
        .limit(remaining)
        .lean();
      questions.push(...additionalQuestions);
    }

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    handleError(res, error);
  }
};
