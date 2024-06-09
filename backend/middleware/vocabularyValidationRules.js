const { body, validationResult } = require("express-validator");

// Validation rules for vocabulary entries
const vocabularyValidationRules = () => {
  return [
    // hiraganaKatakana is required and must be a string
    body("hiraganaKatakana")
      .trim()
      .isString()
      .withMessage("hiraganaKatakana must be a string")
      .not()
      .isEmpty()
      .withMessage("hiraganaKatakana is required"),

    // meanings.en, meanings.vi are required and must be arrays of strings
    body("meanings.en")
      .isArray()
      .withMessage("English meanings must be an array"),
    body("meanings.en.*")
      .isString()
      .withMessage("Each English meaning must be a string"),
    body("meanings.vi")
      .isArray()
      .withMessage("Vietnamese meanings must be an array"),
    body("meanings.vi.*")
      .isString()
      .withMessage("Each Vietnamese meaning must be a string"),

    // kanji is optional but if provided, it must be a string
    body("kanji")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Kanji must be a string"),

    // sinoVietnameseSounds is optional but if provided, it must be a string
    body("sinoVietnameseSounds")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("SinoVietnameseSounds must be a string"),

    // imageUrl is optional but if provided, it must be a URL
    body("imageUrl")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("ImageUrl must be a valid URL"),

    // examples must be an array of objects with specific fields
    body("examples").isArray().withMessage("Examples must be an array"),
    body("examples.*.sentence")
      .isString()
      .withMessage("Each example sentence must be a string"),
    body("examples.*.meaning.en")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("English example meaning must be a string"),
    body("examples.*.meaning.vi")
      .isString()
      .withMessage("Vietnamese example meaning must be a string"),
  ];
};

// Middleware to use the validation rules and check for errors
const validateVocabulary = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
};

module.exports = {
  vocabularyValidationRules,
  validateVocabulary,
};
