const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  lessonValidationRules,
  validateLesson,
} = require("../middleware/lessonValidationRules");

// Assuming 'admin' and 'teacher' roles have permissions for protected routes
const adminAndTeacherRoles = ["admin", "teacher"];
// Middleware to check if the user has one of the required roles
const requireAdminOrTeacher = roleMiddleware(adminAndTeacherRoles);

// Public GET routes to fetch lessons
router.get("/", lessonController.getAllLessons);
router.get("/:id", lessonController.getLessonById);

// Protected POST route to add a new lesson
router.post(
  "/",
  authMiddleware,
  requireAdminOrTeacher,
  lessonValidationRules(),
  validateLesson,
  lessonController.addLesson
);

// Protected PUT route to update an existing lesson
router.put(
  "/:id",
  authMiddleware,
  requireAdminOrTeacher,
  lessonValidationRules(), // Assuming general update might need validation; adjust as necessary
  validateLesson,
  lessonController.updateLesson
);

// Protected PUT route to modify items within a lesson (e.g., add/remove vocabularies, kanjis, grammars)
// Note: This route does not use the lessonValidationRules middleware as the requirements for adding/removing items might be different.
router.put(
  "/:id/modifyItems",
  authMiddleware,
  requireAdminOrTeacher,
  lessonController.modifyLessonItems
);

// Protected DELETE route to delete a lesson
router.delete(
  "/:id",
  authMiddleware,
  requireAdminOrTeacher,
  lessonController.deleteLesson
);

module.exports = router;
