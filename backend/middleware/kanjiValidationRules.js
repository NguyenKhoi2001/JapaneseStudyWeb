const { body, validationResult } = require("express-validator");

// Validation rules for Kanji entries
const kanjiValidationRules = () => {
  return [
    body("character")
      .trim()
      .isString()
      .withMessage("Character must be a string")
      .not()
      .isEmpty()
      .withMessage("Character is required"),

    body("meaning.jp")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Japanese meaning must be a string"),

    body("meaning.en")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("English meaning must be a string"),

    body("meaning.vi")
      .trim()
      .isString()
      .withMessage("Vietnamese meaning must be a string")
      .not()
      .isEmpty()
      .withMessage("Vietnamese meaning is required"),

    body("sinoVietnameseSounds")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("SinoVietnamese Sounds must be a string"),

    body("onyomi")
      .optional({ checkFalsy: true })
      .isArray()
      .withMessage("Onyomi readings must be an array")
      .bail() // stops running validations if the previous one has failed
      .custom((values) => values.every((value) => typeof value === "string"))
      .withMessage("Each Onyomi reading must be a string"),

    body("kunyomi")
      .optional({ checkFalsy: true })
      .isArray()
      .withMessage("Kunyomi readings must be an array")
      .bail()
      .custom((values) => values.every((value) => typeof value === "string"))
      .withMessage("Each Kunyomi reading must be a string"),

    body("examples.*.kanjiWord")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Each example kanji word must be a string"),

    body("examples.*.hiragana")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Each example hiragana must be a string"),

    body("examples.*.meaning.en")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("English example meaning must be a string"),

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
  console.log(errors.array({ onlyFirstError: true }));
  res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
};

module.exports = {
  kanjiValidationRules,
  validateKanji,
};
