const User = require("../models/user.model");
const UserProgress = require("../models/userProgress.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT token
const generateToken = (userId, roles) => {
  return jwt.sign({ userId, roles }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      displayName,
      roles,
      preferredLanguage = "vn",
    } = req.body;

    const restrictedRoles = ["admin", "teacher"];
    const requiresAdminPrivilege = roles.some((role) =>
      restrictedRoles.includes(role)
    );

    // Check for the presence of any admin in the database
    const adminExists = await User.findOne({ roles: "admin" });

    // Specific checks for role restrictions
    if (requiresAdminPrivilege) {
      // Allow creation of the first admin if no admin exists and the requested role is exclusively 'admin'
      if (roles.includes("admin") && !adminExists) {
        // This block intentionally left blank to allow the creation
      } else if (!req.user || !req.user.roles.includes("admin")) {
        // Restrict creation if not performed by an admin
        return res.status(403).json({
          success: false,
          error: {
            message: "Creating an admin or teacher requires admin privileges.",
          },
        });
      }
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      email,
      passwordHash,
      displayName,
      roles,
      preferences: {
        language: preferredLanguage,
        notificationSettings: {
          emailNotifications: true,
          pushNotifications: false,
        },
      },
    });
    const savedUser = await user.save();
    const token = generateToken(savedUser._id, savedUser.roles);

    res
      .status(201)
      .json({ success: true, data: { token, userId: savedUser._id } });
  } catch (error) {
    const statusCode = error.code === 11000 ? 409 : 500;
    const message =
      error.code === 11000
        ? "Username or email already exists."
        : "Error creating user";
    res.status(statusCode).json({ success: false, error: { message } });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = identifier.includes("@")
      ? await User.findOne({ email: identifier })
      : await User.findOne({ username: identifier });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res
        .status(401)
        .json({ success: false, error: { message: "Invalid credentials." } });
    }

    user.lastLogin = new Date();
    await user.save();
    const token = generateToken(user._id, user.roles);

    res.status(200).json({ success: true, data: { token, userId: user._id } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: "Error logging in", error: error.message },
    });
  }
};

// Get user by ID
const getUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: { message: "User not found." } });
    }

    const isSelf = req.user && req.user.userId === userId;
    const isAdmin =
      req.user && req.user.roles && req.user.roles.includes("admin");
    const { _id, passwordHash, ...userDetails } = user.toObject();
    const data =
      isSelf || isAdmin
        ? { userId: _id, ...userDetails }
        : { userId: _id, displayName: user.displayName, ...userDetails };

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: "Error fetching user", error: error.message },
    });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-passwordHash");
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, error: { message: "User not found." } });
    }

    const { _id, ...userDetails } = updatedUser.toObject();
    res
      .status(200)
      .json({ success: true, data: { userId: _id, ...userDetails } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: "Error updating user", error: error.message },
    });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, error: { message: "User not found." } });
    }

    await UserProgress.deleteMany({ user: userId });
    res.status(200).json({
      success: true,
      data: { message: "User and associated progress deleted successfully." },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: "Error deleting user", error: error.message },
    });
  }
};

module.exports = { createUser, loginUser, getUser, updateUser, deleteUser };
