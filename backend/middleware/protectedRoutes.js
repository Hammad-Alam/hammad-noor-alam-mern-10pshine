const jwt = require("jsonwebtoken");
const pino = require("pino")();

// Middleware to protect routes by verifying JWT token
const ProtectedRoutes = async (req, res, next) => {
  try {
    // Extract token from cookies
    const { token } = req.cookies;
    if (!token) {
      pino.info("User is not logged in");
      return res.status(401).json({ message: "User is not Logged In" });
    }
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    pino.info("User is authorized");
    next();
  } catch (error) {
    // Handle invalid or expired token
    pino.error("Invalid or expired token", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
module.exports = ProtectedRoutes;
