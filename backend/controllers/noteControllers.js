const Note = require("../models/NoteModel");
const { body, validationResult } = require("express-validator");
const pino = require("pino")();

// Creates a new note
exports.createNote = async (req, res) => {
  try {
    // Validate request body
    await Promise.all([
      body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 200 })
        .withMessage("Title cannot exceed 200 characters")
        .run(req),

      body("description")
        .notEmpty()
        .withMessage("Description is required")
        .run(req),
    ]);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      pino.warn("Create note validation error", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tags, category, isPinned } = req.body;

    // Create new note
    const note = await Note.create({
      user: req.userId,
      title,
      description,
      tags,
      category,
      isPinned,
    });

    // Log success and return note
    pino.info({ noteId: note._id }, "Note created successfully");
    res.status(201).json({
      status: "success",
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    // Log error and return error response
    pino.error("Error creating note", error);
    res.status(500).json({ message: "Error creating note" });
  }
};

// Retrieves notes for the authenticated user, with optional filtering.
exports.getNotes = async (req, res) => {
  try {
    // Get query parameters
    const { category, isPinned } = req.query;

    // Initialize filter with mandatory conditions
    const filter = {
      user: req.userId,
      isDeleted: false,
    };

    // Apply optional filters
    if (category) {
      filter.category = category;
    }
    if (isPinned !== undefined) {
      filter.isPinned = isPinned === "true";
    }

    // Fetch notes
    const notes = await Note.find(filter).sort({
      isPinned: -1,
      updatedAt: -1,
    });

    // Log success and return notes
    pino.info(
      {
        userId: req.userId,
        filters: { category, isPinned },
      },
      "Notes fetched successfully"
    );
    res.status(200).json({
      status: "success",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    // Log error and return error response
    pino.error("Error fetching notes", error);
    res.status(500).json({ message: "Error fetching notes" });
  }
};

// Retrieves specific note for the authenticated user
exports.getNoteById = async (req, res) => {
  try {
    // Fetch note using user Id
    const note = await Note.findOne({
      _id: req.params.noteId,
      user: req.userId,
      isDeleted: false,
    });

    // Check validation
    if (!note) {
      pino.info("Note not found");
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      status: "success",
      data: note,
    });
  } catch (error) {
    // Log error and return error response
    pino.error("Error fetching note", error);
    res.status(500).json({ message: "Error fetching note" });
  }
};

// Update a Note by ID
exports.updateNote = async (req, res) => {
  try {
    // Fetch note using user Id
    const note = await Note.findOne({
      _id: req.params.noteId,
      user: req.userId,
      isDeleted: false,
    });

    // Check validation
    if (!note) {
      pino.info("Note not found for update");
      return res.status(404).json({ message: "Note not found" });
    }

    // Update note from request body
    const updates = req.body;
    Object.assign(note, updates);

    // Save updated note
    await note.save();

    // Log success and return response
    pino.info({ noteId: note._id }, "Note updated successfully");

    res.status(200).json({
      status: "success",
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    // Log error and return error response
    pino.error("Error updating note", error);
    res.status(500).json({ message: "Error updating note" });
  }
};

// Soft Delete a Note by ID
exports.deleteNote = async (req, res) => {
  try {
    // Fetch note using user Id
    const note = await Note.findOne({
      _id: req.params.noteId,
      user: req.userId,
      isDeleted: false,
    });

    // Check validation
    if (!note) {
      pino.info("Note not found for deletion");
      return res.status(404).json({ message: "Note not found" });
    }

    // Update flag
    note.isDeleted = true;
    await note.save();

    // Log success and return response
    pino.info({ noteId: note._id }, "Note deleted successfully");

    res.status(200).json({
      status: "success",
      message: "Note deleted successfully",
    });
  } catch (error) {
    // Log error and return error response
    pino.error("Error deleting note", error);
    res.status(500).json({ message: "Error deleting note" });
  }
};
