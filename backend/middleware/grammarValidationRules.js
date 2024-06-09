const { body, validationResult } = require("express-validator");

// Unified and improved validation rules for grammar entries
const grammarValidationRules = () => {
  return [
    // Validate Japanese fields - optional
    body("jp.title")
      .optional({ checkFalsy: true })
      .isString()
      .trim()
      .withMessage("Japanese title must be a string"),
    body("jp.htmlContent")
      .optional({ checkFalsy: true })
      .isString()
      .trim()
      .withMessage("Japanese HTML content must be a string"),

    // Validate English fields - optional
    body("en.title")
      .optional({ checkFalsy: true })
      .isString()
      .trim()
      .withMessage("English title must be a string"),
    body("en.htmlContent")
      .optional({ checkFalsy: true })
      .isString()
      .trim()
      .withMessage("English HTML content must be a string"),

    // Validate Vietnamese fields - required
    body("vi.title")
      .not()
      .isEmpty()
      .trim()
      .isString()
      .withMessage("Vietnamese title is required and must be a string"),
    body("vi.htmlContent")
      .not()
      .isEmpty()
      .trim()
      .isString()
      .withMessage("Vietnamese HTML content is required and must be a string"),
  ];
};

// Middleware to use the validation rules and check for errors
const validateGrammar = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Grammar validation failed with the following errors:");
    errors.array().forEach((error) => {
      console.log(`Field: ${error.param}, Message: ${error.msg}`);
    });
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = {
  grammarValidationRules,
  validateGrammar,
};
