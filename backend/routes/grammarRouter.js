const express = require("express");
const router = express.Router();
const grammarController = require("../controllers/grammarController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  grammarValidationRules,
  validateGrammar,
} = require("../middleware/grammarValidationRules"); // Adjust the path as necessary

const adminAndTeacherRoles = ["admin", "teacher"];

// Public GET routes
router.get("/", grammarController.getAllGrammars);
router.get("/:id", grammarController.getGrammarById);

// Protected POST, PUT, DELETE routes with validation
router.post(
  "/",
  authMiddleware,
  roleMiddleware(adminAndTeacherRoles),
  grammarValidationRules(),
  validateGrammar,
  grammarController.addGrammar
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(adminAndTeacherRoles),
  grammarValidationRules(),
  validateGrammar,
  grammarController.updateGrammar
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(adminAndTeacherRoles),
  grammarController.deleteGrammar
);

module.exports = router;
