const express = require("express");
const ProtectedRoutes = require("../middleware/protectedRoutes.js");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUser,
} = require("../controllers/authControllers.js");

const router = express.Router();

// Public routes
router.post("/register", register); // Register a new user
router.post("/login", login); // Login a user
router.post("/forgot-password", forgotPassword); // Send password reset OTP
router.post("/reset-password", resetPassword); // Reset password

// Protected routes
router.get("/logout", ProtectedRoutes, logout); // Logout a user
router.get("/me", ProtectedRoutes, getUser); // Get current user data

module.exports = router;