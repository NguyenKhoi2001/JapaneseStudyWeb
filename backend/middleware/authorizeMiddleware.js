const User = require("../models/user.model");

const authorizeMiddleware = async (req, res, next) => {
  try {
    const userId = req.params.userId ? req.params.userId : req.params.id;
    const authenticatedUserId = req.user.userId; // Assuming the user ID is stored as 'userId' in JWT payload
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found", code: "USER_NOT_FOUND" },
      });
    }

    // Check if the authenticated user is the one who is calling or if they're an admin
    const isAdmin = req.user.roles && req.user.roles.includes("admin");
    if (userId === authenticatedUserId || isAdmin) {
      next(); // User is authorized
    } else {
      return res.status(403).json({
        success: false,
        error: {
          message: "Not authorized to access this resource",
          code: "UNAUTHORIZED_ACCESS",
        },
      });
    }
  } catch (error) {
    console.error("Error from authorize middleware:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Server error checking user authorization",
        error: error.message,
      },
    });
  }
};

module.exports = authorizeMiddleware;
