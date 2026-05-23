// src/modules/ai/controllers/aiNotes.controller.js
import asyncHandler from "../../../utils/asyncHandler.js";
import rateLimitAI from "../../../middleware/aiRateLimit.middleware.js";

import {
  generateAiNoteService,
  regenerateAiNoteService,
  getAiNotesService,
  deleteAiNoteService,
  generateAiNoteFromTodoService,
  regenerateAiNoteFromTodoService,
  getAiNoteByTodoService,
} from "../services/aiNotes.service.js";

/* =====================================================
   AI NOTES CONTROLLER
   Keeps /api/ai contract unchanged
===================================================== */

/* =========================
   POST /api/ai/notes
========================= */
export const generateAiNote = [
  rateLimitAI,
  asyncHandler(async (req, res) => {
    const { topic, level = "short" } = req.body;

    const note = await generateAiNoteService({
      userId: req.user._id,
      topic,
      level,
    });

    res.status(201).json(note);
  }),
];

/* =========================
   POST /api/ai/notes/:id/regenerate
========================= */
export const regenerateAiNote = [
  rateLimitAI,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const note = await regenerateAiNoteService({
      userId: req.user._id,
      noteId: id,
    });

    res.status(200).json(note);
  }),
];

/* =========================
   GET /api/ai/notes
========================= */
export const getAiNotes = asyncHandler(async (req, res) => {
  const notes = await getAiNotesService({ userId: req.user._id });
  res.status(200).json(notes);
});

/* =========================
   DELETE /api/ai/notes/:id
========================= */
export const deleteAiNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await deleteAiNoteService({
    userId: req.user._id,
    noteId: id,
  });

  res.status(200).json(result);
});

/* =========================
   POST /api/ai/todos/:todoId/note
========================= */
export const generateAiNoteFromTodo = [
  rateLimitAI,
  asyncHandler(async (req, res) => {
    const { todoId } = req.params;

    const result = await generateAiNoteFromTodoService({
      userId: req.user._id,
      todoId,
    });

    // ✅ Status code rule:
    // 200 → existing note returned
    // 201 → newly created note
    const statusCode = result?.isExisting ? 200 : 201;

    res.status(statusCode).json(result.note);
  }),
];

/* =========================
   POST /api/ai/todos/:todoId/note/regenerate
========================= */
export const regenerateAiNoteFromTodo = [
  rateLimitAI,
  asyncHandler(async (req, res) => {
    const { todoId } = req.params;

    const note = await regenerateAiNoteFromTodoService({
      userId: req.user._id,
      todoId,
    });

    res.status(200).json(note);
  }),
];

/* =========================
   GET /api/ai/notes/todo/:todoId
========================= */
export const getAiNoteByTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  const note = await getAiNoteByTodoService({
    userId: req.user._id,
    todoId,
  });

  res.status(200).json(note);
});
