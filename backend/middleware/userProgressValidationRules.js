const { body, validationResult } = require("express-validator");

// Validation rules for user progress
const userProgressValidationRules = () => [
  body("user", "User ID is required and must be a valid ObjectId.")
    .not()
    .isEmpty()
    .isMongoId(),
  body("lesson", "Lesson ID is required and must be a valid ObjectId.")
    .not()
    .isEmpty()
    .isMongoId(),
  body("score", "Score is required and must be a number.")
    .not()
    .isEmpty()
    .isNumeric()
    .custom((value) => value >= 0 && value <= 100) // Assuming score is a percentage
    .withMessage("Score must be between 0 and 100."),
];

// Middleware to check for validation errors in user progress submissions
const validateUserProgress = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Log the validation errors to the console for debugging
  console.log("User progress validation failed:", errors.array());

  // Return a structured error response
  res.status(400).json({
    success: false,
    error: {
      message: "Validation errors",
      details: errors.array().map((err) => ({
        field: err.param,
        error: err.msg,
      })),
    },
  });
};

module.exports = {
  userProgressValidationRules,
  validateUserProgress,
};
