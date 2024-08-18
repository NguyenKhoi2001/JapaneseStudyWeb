const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  getPublicUserData,
  getPrivateUserData,
  getAllUserData,
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

// Route to get private user data (accessible only to the user or admin)
router.get("/private/:id", authMiddleware, getPrivateUserData);

// Route to get public user data (accessible to anyone)
router.get("/public/:id", getPublicUserData);

// Route to get all user data publicly
router.get("/all", getAllUserData);

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
