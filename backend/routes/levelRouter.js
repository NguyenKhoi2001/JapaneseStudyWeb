const express = require("express");
const router = express.Router();
const levelController = require("../controllers/levelController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
// Import the validation rules and the validate middleware for levels
const {
  levelValidationRules,
  validateLevel,
} = require("../middleware/levelValidationRules");

const adminAndTeacherRoles = ["admin", "teacher"];

// Public GET routes
router.get("/", levelController.getAllLevels);
router.get("/:id", levelController.getLevelById);

// Protected POST route with validation
router.post(
  "/",
  authMiddleware,
  roleMiddleware(adminAndTeacherRoles),
  levelValidationRules(), // Add the validation rules for level
  validateLevel, // Add the middleware to check for validation errors
  levelController.addLevel
);

// Protected PUT route with validation
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(adminAndTeacherRoles),
  levelValidationRules(), // Also validate levels on update
  validateLevel, // Check for validation errors
  levelController.updateLevel
);

// Protected DELETE route
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(adminAndTeacherRoles),
  levelController.deleteLevel
);

module.exports = router;
