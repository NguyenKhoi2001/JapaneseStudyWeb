const User = require("../models/user.model");

const preventAdminModification = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const requestingUserId = req.user.userId;

    if (targetUserId === requestingUserId) {
      return next(); // Allow admins to modify their own account
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const isTargetAdmin = targetUser.roles.includes("admin");
    const isRequestingAdmin = req.user.roles.includes("admin");

    if (isTargetAdmin && isRequestingAdmin) {
      return res
        .status(403)
        .send({ message: "Admins cannot modify other admin accounts." });
    }

    next(); // Proceed if the target user is not an admin or if other conditions are met
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

module.exports = preventAdminModification;
