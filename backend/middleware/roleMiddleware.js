const roleMiddleware = (roles) => (req, res, next) => {
  if (!req.user) {
    return res
      .status(403)
      .send({ message: "Forbidden: No user authenticated" });
  }

  const hasRole = roles.some((role) => req.user.roles.includes(role));
  if (!hasRole) {
    return res
      .status(403)
      .send({ message: "Forbidden: Insufficient privileges" });
  }

  next();
};
module.exports = roleMiddleware;
