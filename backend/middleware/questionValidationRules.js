const { body, validationResult } = require("express-validator");

// Validation rules for question entries
const questionValidationRules = () => {
  return [
    // Validate 'text' field: non-empty string
    body("text")
      .trim()
      .isString()
      .withMessage("Question text must be a string")
      .notEmpty()
      .withMessage("Question text is required"),

    // Validate 'answers' array: non-empty array of strings
    body("answers")
      .isArray()
      .withMessage("Answers must be provided as an array")
      .notEmpty()
      .withMessage("Answers must be an array with at least one answer")
      .custom((answers) =>
        answers.every((answer) => typeof answer === "string")
      )
      .withMessage("Every answer must be a string"),

    // Validate 'correctAnswer' field: a number within the range of 'answers' array indices
    body("correctAnswer")
      .isInt({ min: 0 })
      .withMessage("Correct answer index must be a non-negative integer")
      .custom(
        (correctAnswer, { req }) => correctAnswer < req.body.answers.length
      )
      .withMessage("Correct answer index is out of bounds"),

    // Validate 'difficulty' field: must be one of the enumerated options
    body("difficulty")
      .isIn(["Easy", "Medium", "Hard"])
      .withMessage("Difficulty must be Easy, Medium, or Hard"),
  ];
};

// Middleware to check for validation errors
const validateQuestion = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Validation errors",
        details: errors.array({ onlyFirstError: true }),
      },
    });
  }
  next();
};

module.exports = {
  questionValidationRules,
  validateQuestion,
};
