const roleMiddleware = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      success: false,
      error: { message: "Forbidden: No user authenticated", code: "NO_USER" },
    });
  }

  const hasRole = roles.some(
    (role) => req.user.roles && req.user.roles.includes(role)
  );
  if (!hasRole) {
    return res.status(403).json({
      success: false,
      error: {
        message: "Forbidden: Insufficient privileges",
        code: "INSUFFICIENT_PRIVILEGES",
      },
    });
  }

  next();
};

module.exports = roleMiddleware;
