import express from 'express';
import ProtectedRoutes from '../middleware/protectedRoutes.js';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  markNotePinned,
  deleteNote,
} from '../controllers/noteControllers.js';

const router = express.Router();

// Protected routes
router.post("/create", ProtectedRoutes, createNote); // Create new note
router.get("/", ProtectedRoutes, getNotes); // Get all notes
router.get("/:noteId", ProtectedRoutes, getNoteById); // Get note by Id
router.patch("/:noteId", ProtectedRoutes, updateNote); // Update note by Id
router.delete("/:noteId", ProtectedRoutes, deleteNote); // Delete note by Id
router.patch("/:noteId/pin", ProtectedRoutes, markNotePinned); // Mark note as pinned

export default router;
