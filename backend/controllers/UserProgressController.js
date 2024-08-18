const Lesson = require("../models/lesson.model");
const Level = require("../models/level.model");
const User = require("../models/user.model");
const UserProgress = require("../models/userProgress.model");

// Add UserProgress
exports.addUserProgress = async (req, res) => {
  const { user, lesson, score } = req.body;

  try {
    const existingProgress = await UserProgress.findOne({ user, lesson });
    if (existingProgress) {
      if (score > existingProgress.score) {
        existingProgress.score = score;
        existingProgress.passed = score >= 70;
        await existingProgress.save();
        return res.status(200).json({ success: true, data: existingProgress });
      }
      return res.status(200).json({ success: true, data: existingProgress });
    } else {
      const newUserProgress = new UserProgress({
        user,
        lesson,
        score,
        passed: score >= 70,
      });
      const savedUserProgress = await newUserProgress.save();
      res.status(201).json({ success: true, data: savedUserProgress });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

// Get UserProgress by User
exports.getUserProgressByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const progress = await UserProgress.find({ user: userId }).populate(
      "lesson"
    );
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

exports.canStartLesson = async (req, res) => {
  const { lessonId } = req.params;
  const { userId } = req.query; // Now accepting userId as a query parameter

  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, error: { message: "Lesson not found" } });
    }

    const level = await Level.findOne({ lessons: lesson._id });
    if (!level) {
      return res
        .status(404)
        .json({ success: false, error: { message: "Level not found" } });
    }

    // If it's the first lesson in the level, allow anyone to start
    if (String(level.lessons[0]) === String(lessonId)) {
      return res.status(200).json({ success: true, data: { canStart: true } });
    }

    // For subsequent lessons, check user progress if userId is provided
    if (userId) {
      const user = await User.findById(userId);
      // Allow immediate access if the user is a teacher or admin
      if (
        user &&
        (user.roles.includes("teacher") || user.roles.includes("admin"))
      ) {
        return res
          .status(200)
          .json({ success: true, data: { canStart: true } });
      }

      //if not then check if previous lesson passed, if yes then allow
      const currentLessonIndex = level.lessons.indexOf(lesson._id);
      if (currentLessonIndex === -1 || currentLessonIndex === 0) {
        return res.status(404).json({
          success: false,
          error: { message: "Lesson not properly configured in level" },
        });
      }

      const previousLessonId = level.lessons[currentLessonIndex - 1];
      const previousLessonPassed = await UserProgress.findOne({
        user: userId,
        lesson: previousLessonId,
        passed: true,
      });

      if (!previousLessonPassed) {
        return res.status(403).json({
          success: false,
          error: { message: "Must pass the previous lesson first" },
        });
      }

      return res.status(200).json({ success: true, data: { canStart: true } });
    } else {
      // If no userId is provided, restrict access to subsequent lessons
      return res.status(403).json({
        success: false,
        error: {
          message: "User ID required for lessons beyond the first in a level",
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// Calculate user's progress in a level
exports.calculateLevelProgress = async (req, res) => {
  const { userId, levelId } = req.params;
  try {
    const level = await Level.findById(levelId);
    if (!level)
      return res
        .status(404)
        .json({ success: false, error: { message: "Level not found" } });

    const totalLessons = level.lessons.length;
    const passedLessonsCount = await UserProgress.countDocuments({
      user: userId,
      lesson: { $in: level.lessons },
      passed: true,
    });

    const progressPercentage = (passedLessonsCount / totalLessons) * 100;
    res.status(200).json({
      success: true,
      data: { progress: progressPercentage.toFixed(2) + "%" },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
