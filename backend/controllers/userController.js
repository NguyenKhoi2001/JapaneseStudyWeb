const User = require("../models/user.model"); // Update the path as necessary
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { username, email, password, displayName, role, preferredLanguage } =
      req.body;

    // Check if the admin role needs to be created and handle accordingly
    if (role === "admin") {
      const adminExists = await User.findOne({ roles: "admin" });
      if (adminExists) {
        if (!req.user || !req.user.roles.includes("admin")) {
          return res.status(403).send({
            message: "Only an existing admin can create more admin accounts.",
          });
        }
      }
    }

    const saltRounds = process.env.BCRYPT_SALT_ROUNDS
      ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
      : 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      email,
      passwordHash: hashedPassword,
      displayName,
      roles: [role],
      preferences: {
        language: preferredLanguage || "Vietnamese", // Use the provided preferredLanguage or default to "Vietnamese"
        notificationSettings: {
          emailNotifications: true,
          pushNotifications: false,
        },
      },
    });

    await user.save();

    // Generate token for the newly created user
    const token = jwt.sign(
      { userId: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Return the token
    res.status(201).send({ token: token, userId: user._id });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({ message: "Username or email already exists." });
    } else {
      console.error("Error creating user:", error); // Adjust based on your logging strategy
      res
        .status(500)
        .send({ message: "Error creating user", error: error.message });
    }
  }
};

// Login method
const loginUser = async (req, res) => {
  const { identifier, password } = req.body; // 'identifier' can be either an email or a username
  try {
    // Determine if the identifier is an email or a username
    const user = identifier.includes("@")
      ? await User.findOne({ email: identifier })
      : await User.findOne({ username: identifier });

    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      // Use the same generic error message
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Optionally adjust token expiration based on your needs
    const token = jwt.sign(
      { userId: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).send({ token: token, userId: user._id });
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error: error.message });
  }
};

// Get User Info
const getUser = async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const user = await User.findById(requestedUserId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Use req.user directly to determine if the request is from the user themselves or an admin
    const isSelf = req.user && req.user.userId === requestedUserId;
    const isAdmin =
      req.user && req.user.roles && req.user.roles.includes("admin");

    if (isSelf || isAdmin) {
      // Return all details except sensitive information
      const { passwordHash, ...userDetails } = user.toObject();
      return res.status(200).send(userDetails);
    } else {
      // Return limited data for other cases
      const limitedUserData = {
        displayName: user.displayName,
        profilePicture: user.profilePicture,
        dateJoined: user.dateJoined,
        lastLogin: user.lastLogin,
        progress: user.progress,
        preferences: user.preferences,
        roles: user.roles,
      };
      return res.status(200).send(limitedUserData);
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching user", error: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // ID of the user to update
    const updates = req.body;

    // Proceed with the update for allowed fields, assuming authorization is handled by middleware
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-passwordHash");
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    // Exclude sensitive information and return the updated user details
    res
      .status(200)
      .send({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating user", error: error.message });
  }
};

//delete
const deleteUser = async (req, res) => {
  try {
    // The actual deletion is straightforward since authorization is handled by middleware
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting user", error: error.message });
  }
};

module.exports = { createUser, loginUser, getUser, updateUser, deleteUser };
