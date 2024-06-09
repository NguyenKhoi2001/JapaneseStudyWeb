const express = require("express");
const router = express.Router();
const vocabularyController = require("../controllers/vocabularyController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  vocabularyValidationRules,
  validateVocabulary,
} = require("../middleware/vocabularyValidationRules");

//roles that are allowed to modify vocabularies
const modifyRoles = ["admin", "teacher"];

// Routes for public access
router.get("/", vocabularyController.getAllVocabularies); // Public access to all vocabularies
router.get("/:id", vocabularyController.getVocabularyById); // Public access to a single vocabulary by ID

// Routes requiring authentication and specific roles, now with validation
router.post(
  "/",
  authMiddleware,
  roleMiddleware(modifyRoles),
  vocabularyValidationRules(),
  validateVocabulary,
  vocabularyController.addVocabulary // Only admin or teacher can add, if the request passes validation
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(modifyRoles),
  vocabularyValidationRules(),
  validateVocabulary,
  vocabularyController.updateVocabulary // Only admin or teacher can update, if the request passes validation
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(modifyRoles),
  vocabularyController.deleteVocabulary // Only admin or teacher can delete
);

module.exports = router;
