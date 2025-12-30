const express = require("express");
const ProtectedRoutes = require("../middleware/protectedRoutes.js");
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/noteControllers.js");

const router = express.Router();

// Protected routes
router.post("/create", ProtectedRoutes, createNote); // Create new note
router.get("/", ProtectedRoutes, getNotes); // Get all notes
router.get("/:noteId", ProtectedRoutes, getNoteById); // Get note by Id
router.put("/:noteId", ProtectedRoutes, updateNote); // Update note by Id
router.delete("/:noteId", ProtectedRoutes, deleteNote); // Delete note by Id

module.exports = router;
