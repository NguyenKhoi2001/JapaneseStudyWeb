const { body, validationResult } = require("express-validator");

// Helper function for validating array fields containing ObjectIds
const createArrayObjectIdValidation = (field) => [
  body(field)
    .optional({ checkFalsy: true, nullable: true }) // Makes the field optional but ensures clean data
    .isArray({ min: 0 })
    .withMessage(`${field} must be an array if provided.`),
  body(`${field}.*`)
    .optional()
    .isMongoId()
    .withMessage(`Each item in ${field} must be a valid ObjectId`),
];

// Validation rules for lesson entries
const lessonValidationRules = () => [
  body("title.vi")
    .trim() // To avoid titles with only whitespace
    .not()
    .isEmpty()
    .withMessage("Vietnamese title is required and cannot be empty.")
    .isString()
    .withMessage("Vietnamese title must be a string.")
    .isLength({ max: 100 }) // Example of limiting title length
    .withMessage("Vietnamese title cannot be longer than 100 characters."),

  body("title.en")
    .optional()
    .trim()
    .isString()
    .withMessage("English title must be a string when provided.")
    .isLength({ max: 100 })
    .withMessage("English title cannot be longer than 100 characters."),

  body("title.jp")
    .optional()
    .trim()
    .isString()
    .withMessage("Japanese title must be a string when provided.")
    .isLength({ max: 100 })
    .withMessage("Japanese title cannot be longer than 100 characters."),

  // All these fields are treated as optional arrays of ObjectIds
  ...createArrayObjectIdValidation("vocabularies"),
  ...createArrayObjectIdValidation("kanjis"),
  ...createArrayObjectIdValidation("grammars"),
  ...createArrayObjectIdValidation("questions"),
];

// Middleware to check for validation errors, reporting all errors
const validateLesson = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  // Potentially separate error messages for client and internal logging
  console.log("Lesson validation failed:", errors.array());
  res.status(400).json({
    errors: errors
      .array()
      .map((error) => ({ msg: error.msg, param: error.param })),
  });
};

module.exports = {
  lessonValidationRules,
  validateLesson,
};
