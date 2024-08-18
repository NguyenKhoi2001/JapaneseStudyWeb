const User = require("../models/user.model");
const UserProgress = require("../models/userProgress.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
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

    // Attempt to find the user either by email or username
    const user = identifier.includes("@")
      ? await User.findOne({ email: identifier })
      : await User.findOne({ username: identifier });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Account not found. Please check the entered credentials.",
        },
      });
    }

    // Check if the password is correct
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        success: false,
        error: { message: "Invalid credentials. Please try again." },
      });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.roles);

    // Respond with user data and token
    res.status(200).json({
      success: true,
      data: { token, userId: user._id },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({
      success: false,
      error: { message: "An error occurred during the login process." },
    });
  }
};

const getPrivateUserData = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId).select("-passwordHash -__v");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: { message: "User not found." } });
    }

    const isSelf = req.user && req.user.userId === userId;
    const isAdmin =
      req.user && req.user.roles && req.user.roles.includes("admin");

    if (isSelf || isAdmin) {
      const responseData = { ...user.toObject(), userId: user._id }; // Explicitly setting userId
      delete responseData._id; // Removing the default _id for clarity
      res.status(200).json({ success: true, data: responseData });
    } else {
      return res
        .status(403)
        .json({ success: false, error: { message: "Access denied." } });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: "Error fetching user details", error: error.message },
    });
  }
};

const getPublicUserData = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId).select(
      "-passwordHash -username -email -preferences.notificationSettings -__v"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: { message: "User not found." } });
    }

    const responseData = { ...user.toObject(), userId: user._id }; // Adding userId for clarity
    delete responseData._id; // Ensuring _id is not included
    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: "Error fetching user", error: error.message },
    });
  }
};

const getAllUserData = async (req, res) => {
  try {
    // Fetch all users while excluding specific fields
    const users = await User.find({}).select(
      "-passwordHash -username -email -preferences.notificationSettings -__v"
    );

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: { message: "No users found." } });
    }

    // Transforming data to add userId for each user
    const responseData = users.map((user) => {
      const userData = user.toObject();
      userData.userId = userData._id; // Assigning _id to a new field called userId for clarity
      delete userData._id; // Removing the _id field
      return userData;
    });

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error fetching users:", error); // Log the error for more information
    res.status(500).json({
      success: false,
      error: { message: "Error fetching users", error: error.message },
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { imageFile, ...updates } = req.body; // Extract imageFile and other updates separately

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: { message: "User not found." } });
    }

    // Handle image upload if image data is provided in Base64 format
    if (imageFile) {
      // Check and possibly delete the old image if it exists
      if (user.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      }

      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(imageFile, {
        folder: "japaneseWeb/users",
      });
      updates.profilePicture = result.url;
      updates.profilePicturePublicId = result.public_id;
    }

    // Update user with the new data
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-passwordHash");

    const { _id, ...userDetails } = updatedUser.toObject();
    res
      .status(200)
      .json({ success: true, data: { userId: _id, ...userDetails } });
  } catch (error) {
    console.error("Error updating user: ", error);
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
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: { message: "User not found." } });
    }

    // If user has a profile picture, delete it from Cloudinary
    if (user.profilePicturePublicId) {
      await cloudinary.uploader.destroy(user.profilePicturePublicId);
    }

    await UserProgress.deleteMany({ user: userId }); // Delete associated user progress
    await User.findByIdAndDelete(userId); // Delete the user

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
module.exports = {
  createUser,
  loginUser,
  getPrivateUserData,
  getPublicUserData,
  getAllUserData,
  updateUser,
  deleteUser,
};
