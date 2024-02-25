const User = require("../models/user.model"); // Adjust the path as necessary

const authorizeUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const authenticatedUserId = req.user.userId; // Assuming the user ID is stored as 'userId' in JWT payload
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    console.log("authorize: ", await User.findById(authenticatedUserId));
    // Check if the authenticated user is the one who is being updated or if they're an admin
    const isAdmin = req.user.roles && req.user.roles.includes("admin");
    console.log("is admin: ", isAdmin);
    if (userId === authenticatedUserId || isAdmin) {
      next(); // User is authorized
    } else {
      return res
        .status(403)
        .send({ message: "Not authorized to update this user" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Server error checking user authorization",
      error: error.message,
    });
  }
};

module.exports = authorizeUser;
