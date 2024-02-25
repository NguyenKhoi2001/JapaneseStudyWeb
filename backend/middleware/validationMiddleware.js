const { body, validationResult } = require("express-validator");

// Define your validation rules
const userValidationRules = () => {
  return [
    // Username must be alphanumeric and between 3-30 characters
    body("username")
      .isAlphanumeric()
      .withMessage("Username must be alphanumeric")
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters"),
    // Email must be valid
    body("email").isEmail().withMessage("Must be a valid email address"),
    // Password must be 3-30 characters long (customize this rule as needed)
    body("password")
      .isLength({ min: 3, max: 30 })
      .withMessage("Password must be between 3 and 30 characters"),
    // displayName is optional but if provided, it must be a string
    body("displayName")
      .optional()
      .isString()
      .withMessage("Display Name must be a string"),
    // Role is required
    body("roles").not().isEmpty().withMessage("Role is required"),
  ];
};

// Middleware to use the validation rules and check for errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  res.status(400).json({ errors: errors.array() + "from authMiddleware" });
};

module.exports = {
  userValidationRules,
  validate,
};
