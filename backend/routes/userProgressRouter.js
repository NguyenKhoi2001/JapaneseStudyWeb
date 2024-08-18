const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeUser = require("../middleware/authorizeMiddleware");
const userProgressController = require("../controllers/UserProgressController");
const {
  userProgressValidationRules,
  validateUserProgress,
} = require("../middleware/userProgressValidationRules");

// Route to add or update user progress. Requires the user to be authenticated and input validation.
router.post(
  "/",
  authMiddleware,
  userProgressValidationRules(),
  validateUserProgress,
  userProgressController.addUserProgress
);

// Route to get user progress by user ID. Requires the user to be authenticated and allows users to access only their progress.
router.get(
  "/user/:userId",
  authMiddleware,
  authorizeUser,
  userProgressController.getUserProgressByUser
);

// Modify the route to accept lessonId and optional userId as a query parameter
router.get("/canStart/:lessonId", userProgressController.canStartLesson);

// For calculating a user's progress within a specific level. This should also ensure that only the user or authorized roles can access this information.
router.get(
  "/progress/:userId/:levelId",
  authMiddleware,
  authorizeUser,
  userProgressController.calculateLevelProgress
);

module.exports = router;
