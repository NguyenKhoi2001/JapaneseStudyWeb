const { body, validationResult } = require("express-validator");

// Define your validation rules
const userValidationRules = () => {
  return [
    // Username must be lowercase, alphabetical only, and between 8-32 characters
    body("username")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .matches(/^[a-z][a-z0-9]*$/)
      .withMessage(
        "Username must start with a letter and contain only alphanumeric characters"
      )
      .isLength({ min: 8, max: 32 })
      .withMessage("Username must be between 8 and 32 characters"),

    // Email must be valid and in lowercase
    body("email")
      .isEmail()
      .withMessage("Must be a valid email address")
      .isLowercase()
      .withMessage("Email must be in lowercase"),

    // Password rules
    body("password")
      .isLength({ min: 8, max: 32 })
      .withMessage("Password must be between 8 and 32 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[\^$*.\[\]{}()?\-"!@#%&/,><':;|_~`]/)
      .withMessage("Password must contain at least one special character"),

    // displayName is optional but if provided, it must be a string
    body("displayName")
      .optional()
      .isString()
      .withMessage("Display Name must be a string"),

    // Role should not be an empty array or null
    body("roles")
      .not()
      .isEmpty()
      .withMessage("Role is required")
      .isArray()
      .withMessage("Roles must be an array")
      .custom((roles) => roles.length > 0)
      .withMessage("Roles array cannot be empty"),
  ];
};

// Middleware to use the validation rules and check for errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("User validation failed:", errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = {
  userValidationRules,
  validate,
};
