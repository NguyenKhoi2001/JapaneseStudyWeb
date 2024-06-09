const User = require("../models/user.model");

const preventAdminModification = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const requestingUserId = req.user.userId;

    // Allow admins to modify their own account
    if (targetUserId === requestingUserId) {
      return next();
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found", code: "USER_NOT_FOUND" },
      });
    }

    const isTargetAdmin =
      targetUser.roles && targetUser.roles.includes("admin");
    const isRequestingAdmin =
      req.user.roles && req.user.roles.includes("admin");

    // Prevent an admin from modifying another admin's account
    if (isTargetAdmin && isRequestingAdmin) {
      return res.status(403).json({
        success: false,
        error: {
          message: "Admins cannot modify other admin accounts.",
          code: "ADMIN_MOD_RESTRICTED",
        },
      });
    }

    next(); // Proceed if the target user is not an admin or if other conditions are met
  } catch (error) {
    console.error("Error in preventAdminModification middleware:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Server error checking user roles",
        error: error.message,
      },
    });
  }
};

module.exports = preventAdminModification;
