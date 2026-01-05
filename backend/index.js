// Import required modules
const connectToMongo = require("./config/db");
const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pino = require('pino')();

// Enable CORS, Cookie, and JSON parsing
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Import routes
const authRoutes = require("./routes/authRoutes");

// Define API routes
app.use("/api/auth", authRoutes); // Authentication routes

// Welcome route
app.get("/", (req, res) => {
  pino.info('Welcome route accessed');
  res.json({ message: "Welcome to WH Closet API" });
});

// Health check route
app.get("/health", (req, res) => {
  pino.info('Health check route accessed');
  res.json({ status: "ok", message: "WH Closet API is running" });
});

// Start server and listen on specified port
app.listen(port, () => {
  pino.info(`WH Closet backend listening on port: http://localhost:${port}`);
});

// Establish connection to MongoDB
connectToMongo();

// Global error handling middleware
app.use((err, req, res, next) => {
  pino.error('Global error handler:', err);
  res.status(500).json({ message: "Internal Server Error" });
});