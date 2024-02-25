const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = tokenHeader.split(" ")[1]; // Assumes token is sent as "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user payload to request object
    next();
  } catch (error) {
    // Check specific error types
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token is expired", code: "TOKEN_EXPIRED" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Token is invalid", code: "TOKEN_INVALID" });
    }

    // For other types of errors
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
