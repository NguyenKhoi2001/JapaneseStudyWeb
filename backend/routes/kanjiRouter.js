const express = require("express");
const router = express.Router();
const kanjiController = require("../controllers/kanjiController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  kanjiValidationRules,
  validateKanji,
} = require("../middleware/kanjiValidationRules"); // Assuming you have a similar setup for kanji validation

const adminAndTeacherRoles = ["admin", "teacher"];

// Public GET routes
router.get("/", kanjiController.getAllKanjis);
router.get("/:id", kanjiController.getKanjiById);

// Protected POST, PUT, DELETE routes with validation
router.post(
  "/",
  authMiddleware,
  roleMiddleware(adminAndTeacherRoles),
  kanjiValidationRules(),
  validateKanji,
  kanjiController.addKanji
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(adminAndTeacherRoles),
  kanjiValidationRules(),
  validateKanji,
  kanjiController.updateKanji
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(adminAndTeacherRoles),
  kanjiController.deleteKanji
);

module.exports = router;
