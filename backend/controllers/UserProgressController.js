const Lesson = require("../models/lesson.model");
const Level = require("../models/level.model");
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
  const { userId, lessonId } = req.params;
  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson)
      return res
        .status(404)
        .json({ success: false, error: { message: "Lesson not found" } });

    const level = await Level.findOne({ lessons: lesson._id });
    if (!level)
      return res
        .status(404)
        .json({ success: false, error: { message: "Level not found" } });

    if (String(level.lessons[0]) === String(lessonId)) {
      return res.status(200).json({ success: true, data: { canStart: true } });
    }

    const currentLessonIndex = level.lessons.indexOf(lesson._id);
    if (currentLessonIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { message: "Lesson not found in level" },
      });
    }

    if (currentLessonIndex > 0) {
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
    }

    res.status(200).json({ success: true, data: { canStart: true } });
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
