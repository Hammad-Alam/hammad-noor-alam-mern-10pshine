import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";

import pino from "pino";
const logger = pino();

// Register a new user
const register = async (req, res) => {
  try {
    // Input validation
    await Promise.all([
      body("name")
        .isLength({ min: 3 })
        .withMessage("Name should be at least 3 characters long")
        .run(req),
      body("email").isEmail().withMessage("Invalid email address").run(req),
      body("password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .withMessage(
          "Password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character"
        )
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      pino.warn("Registration validation error", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.info("Email already registered");
      return res.status(400).json({
        status: "failed",
        message: "Email already registered",
      });
    }

    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
    });

    logger.info("User registered successfully");
    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error("Error during registration", error);
    res.status(500).json({ message: "Error during registration" });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    // Input validation
    await Promise.all([
      body("email").isEmail().withMessage("Invalid email address").run(req),
      body("password").notEmpty().withMessage("Password is required").run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      pino.warn("Login validation error", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.info("Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Set cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    logger.info("User logged in successfully");
    res.json({
      message: "Login successful",
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error("Error during login", error);
    res.status(500).json({ message: "Error during login" });
  }
};

// Logout a user
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });
    logger.info("User logged out successfully");
    res.json({ message: "Logout successful" });
  } catch (error) {
    logger.error("Error during logout", error);
    res.status(500).json({ message: "Error during logout" });
  }
};

// Get current user data
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      logger.info("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    logger.info("User data retrieved successfully");
    res.json({
      status: "success",
      user,
    });
  } catch (error) {
    logger.error("Error retrieving user data", error);
    res.status(500).json({ message: "Error retrieving user data" });
  }
};

// Send password reset OTP
const forgotPassword = async (req, res) => {
  try {
    // Input validation
    await body("email").isEmail().withMessage("Invalid email address").run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      pino.warn("Forgot password validation error", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      logger.info("Email not registered");
      return res.status(404).json({ message: "Email not registered" });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999);

    // Send OTP to email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `
        Dear ${user.name},
    
        You have requested a password reset for your account. To complete the process, please use the following One-Time Password (OTP):
    
        OTP: ${otp}
    
        This OTP is valid for 15 minutes. Please enter it on the password reset page to create a new password.
    
        If you did not request a password reset, please ignore this email.
    
        Best regards,
        Notes App
      `,
    });

    // Update user's OTP and expiration time
    user.passwordResetOTP = otp;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes validity
    await user.save();

    logger.info("OTP sent to email");
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    logger.error("Error sending OTP", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    // Input validation
    await Promise.all([
      body("email").isEmail().withMessage("Invalid email address").run(req),
      body("otp")
        .isLength({ min: 6, max: 6 })
        .withMessage("Invalid OTP")
        .isNumeric()
        .withMessage("OTP should be numeric")
        .run(req),
      body("newPassword")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .withMessage(
          "Password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character"
        )
        .run(req),
      body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      pino.warn("Reset password validation error", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, newPassword, confirmPassword } = req.body;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      logger.info("New password and confirm password do not match");
      return res.status(400).json({
        message: "New password and confirm password do not match",
      });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      logger.info("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is valid
    if (
      user.passwordResetOTP !== otp ||
      user.passwordResetExpires < Date.now()
    ) {
      logger.info("Invalid or expired OTP");
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // Update the user's password
    user.password = newPassword;
    user.passwordResetOTP = null;
    user.passwordResetExpires = null;
    await user.save();

    logger.info("Password reset successful");
    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    logger.error("Error resetting password", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

export { register, login, logout, getUser, forgotPassword, resetPassword };