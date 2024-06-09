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

const {
  userValidationRules,
  validate,
} = require("../middleware/userValidationRules");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeMiddleware = require("../middleware/authorizeMiddleware");
const preventAdminModification = require("../middleware/preventAdminModification");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", userValidationRules(), validate, createUser);
router.post("/login", loginUser);
router.get("/:id", authMiddleware, authorizeMiddleware, getUser);

router.put(
  "/:id",
  authMiddleware,
  authorizeMiddleware,
  preventAdminModification,
  updateUser
);

router.delete(
  "/:id",
  [authMiddleware, roleMiddleware(["admin"])],
  preventAdminModification,
  deleteUser
);

//create another admin with admin
router.post(
  "/admin",
  authMiddleware,
  roleMiddleware(["admin"]), // Ensures only admins can create admin accounts
  userValidationRules(),
  validate,
  createUser
);

router.post(
  "/teacher",
  authMiddleware,
  roleMiddleware(["admin"]), // Ensures only admins can create teacher accounts
  userValidationRules(),
  validate,
  createUser
);

module.exports = router;
