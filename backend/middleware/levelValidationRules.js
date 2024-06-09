const { body, validationResult } = require("express-validator");

// Function to create validation for an array of ObjectIds
const createObjectIdArrayValidationForLevel = (field) => {
  return [
    body(field)
      .optional({ checkFalsy: true, nullable: true }) // Makes the field optional
      .isArray({ min: 0 })
      .withMessage(`${field} must be an array if provided.`),
    body(`${field}.*`)
      .optional()
      .isMongoId()
      .withMessage(`Each item in ${field} must be a valid ObjectId`),
  ];
};

// Validation rules for Level
const levelValidationRules = () => [
  body("name")
    .isString()
    .not()
    .isEmpty()
    .withMessage("Name is required and must be a string."),
  ...createObjectIdArrayValidationForLevel("lessons"),
];

// Middleware to check for validation errors in Level submissions
const validateLevel = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  console.log("Level validation failed:", errors.array());
  res.status(400).json({
    success: false,
    error: {
      message: "Validation failed",
      errors: errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg })),
    },
  });
};

module.exports = {
  levelValidationRules,
  validateLevel,
};
