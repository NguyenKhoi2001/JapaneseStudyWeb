const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const tokenHeader = req.headers.authorization;

    if (!tokenHeader) {
      return res.status(401).json({
        success: false,
        error: { message: "No token provided", code: "NO_TOKEN" },
      });
    }

    if (!tokenHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: { message: "Invalid token format", code: "INVALID_FORMAT" },
      });
    }

    const token = tokenHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: "No token provided", code: "EMPTY_TOKEN" },
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to request object

    next();
  } catch (error) {
    // Use consistent error handling and messaging
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: { message: "Token is expired", code: "TOKEN_EXPIRED" },
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: { message: "Token is invalid", code: "TOKEN_INVALID" },
      });
    }

    // Handle other possible errors
    return res.status(401).json({
      success: false,
      error: { message: "Unauthorized: Invalid token", code: "UNKNOWN_ERROR" },
    });
  }
};

module.exports = authMiddleware;
