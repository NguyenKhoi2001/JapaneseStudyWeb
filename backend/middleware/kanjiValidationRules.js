const { body, validationResult } = require("express-validator");

// Validation rules for Kanji entries
const kanjiValidationRules = () => {
  return [
    // character is required and must be a string
    body("character")
      .trim()
      .isString()
      .withMessage("Character must be a string")
      .not()
      .isEmpty()
      .withMessage("Character is required"),

    // meaning.jp is optional but must be a string if provided
    body("meaning.jp")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Japanese meaning must be a string"),

    // meaning.en is optional but must be a string if provided
    body("meaning.en")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("English meaning must be a string"),

    // meaning.vi is required and must be a string
    body("meaning.vi")
      .trim()
      .isString()
      .withMessage("Vietnamese meaning must be a string")
      .not()
      .isEmpty()
      .withMessage("Vietnamese meaning is required"),

    // sinoVietnameseSounds is optional but must be a string if provided
    body("sinoVietnameseSounds")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("SinoVietnamese Sounds must be a string"),

    // onyomi is optional but each entry must be a string if provided
    body("onyomi.*")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Each Onyomi reading must be a string"),

    // kunyomi is optional but each entry must be a string if provided
    body("kunyomi.*")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Each Kunyomi reading must be a string"),

    // examples.kanjiWord and examples.hiragana are optional but must be strings if provided
    body("examples.*.kanjiWord")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Each example kanji word must be a string"),
    body("examples.*.hiragana")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Each example hiragana must be a string"),

    // examples.meaning.en is optional but must be a string if provided
    body("examples.*.meaning.en")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("English example meaning must be a string"),

    // examples.meaning.vi is required and must be a string
    body("examples.*.meaning.vi")
      .trim()
      .isString()
      .withMessage("Vietnamese example meaning must be a string")
      .not()
      .isEmpty()
      .withMessage("Vietnamese example meaning is required"),
  ];
};

// Middleware to use the validation rules and check for errors
const validateKanji = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
};

module.exports = {
  kanjiValidationRules,
  validateKanji,
};
