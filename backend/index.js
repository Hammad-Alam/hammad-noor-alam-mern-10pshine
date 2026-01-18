// Import required modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pino from "pino";
import dotenv from "dotenv";

import connectToMongo from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const logger = pino();
const app = express();
const port = process.env.PORT || 5000;

// Enable middleware
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/note", noteRoutes);

// Welcome route
app.get("/", (req, res) => {
  logger.info("Welcome route accessed");
  res.json({ message: "Welcome to Luminote API" });
});

// Health route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// START SERVER ONLY IF NOT TEST
if (process.env.NODE_ENV !== "test") {
  connectToMongo()
    .then(() => {
      app.listen(port, () => {
        logger.info(
          `Luminote backend listening on port: http://localhost:${port}`
        );
      });
    })
    .catch((err) => {
      logger.error("Error connecting to MongoDB", err);
    });
}

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
