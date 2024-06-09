const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  questionValidationRules,
  validateQuestion,
} = require("../middleware/questionValidationRules");

const adminAndTeacherRoles = ["admin", "teacher"];
const requireAdminOrTeacher = roleMiddleware(adminAndTeacherRoles);

router.get("/", questionController.getAllQuestions);
router.get("/:id", questionController.getQuestionById);
router.get(
  "/lesson-questions/:id",
  questionController.getAllQuestionsFromLesson
);
router.get("/level-questions/:id", questionController.getAllQuestionsFromLevel);

// Adding routes for fetching custom questions
router.get(
  "/custom-lesson-questions/:lessonId",
  questionController.getCustomQuestionsFromLesson
);
router.get(
  "/custom-level-questions/:levelId",
  questionController.getCustomQuestionsFromLevel
);

router.post(
  "/",
  authMiddleware,
  requireAdminOrTeacher,
  questionValidationRules(),
  validateQuestion,
  questionController.addQuestion
);

router.put(
  "/:id",
  authMiddleware,
  requireAdminOrTeacher,
  questionValidationRules(),
  validateQuestion,
  questionController.updateQuestion
);

router.delete(
  "/:id",
  authMiddleware,
  requireAdminOrTeacher,
  questionController.deleteQuestion
);

module.exports = router;
