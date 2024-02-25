const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  userValidationRules,
  validate,
} = require("../middleware/validationMiddleware");
const authorizeUser = require("../middleware/authorizeUser");
const preventAdminModification = require("../middleware/preventAdminModification"); // Ensure correct path

// Validation rules for creating a user
const createUserValidations = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  // Add more validations as needed
];

router.post("/user", userValidationRules(), validate, createUser);
router.post("/users/login", loginUser);
router.get("/users/:id", authMiddleware, authorizeUser, getUser);

router.put(
  "/users/:id",
  authMiddleware,
  authorizeUser,
  preventAdminModification,
  updateUser
);
router.delete(
  "/users/:id",
  [authMiddleware, roleMiddleware(["admin"])],
  preventAdminModification,
  deleteUser
);

//create another admin with admin
router.post(
  "/admin/user",
  authMiddleware,
  userValidationRules(),
  validate,
  createUser
);

module.exports = router;
