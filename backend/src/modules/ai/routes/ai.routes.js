// src/modules/ai/routes/ai.routes.js
import express from "express";
import protect from "../../../middleware/auth.middleware.js";

import { generateAiTodos } from "../controllers/aiTodos.controller.js";

import {
  generateAiNote,
  regenerateAiNote,
  getAiNotes,
  deleteAiNote,
  generateAiNoteFromTodo,
  regenerateAiNoteFromTodo,
  getAiNoteByTodo,
} from "../controllers/aiNotes.controller.js";

const router = express.Router();

/* ================= ALL AI ROUTES ARE PROTECTED ================= */
router.use(protect);

/* =====================================================
   AI TODOS
   /api/ai/todos
===================================================== */
router.post("/todos", generateAiTodos);

/* =====================================================
   AI NOTES
   /api/ai/notes
===================================================== */
router.post("/notes", generateAiNote);
router.get("/notes", getAiNotes);
router.delete("/notes/:id", deleteAiNote);
router.post("/notes/:id/regenerate", regenerateAiNote);

/* =====================================================
   TODO → AI NOTE
===================================================== */
router.post("/todos/:todoId/note", generateAiNoteFromTodo);
router.post("/todos/:todoId/note/regenerate", regenerateAiNoteFromTodo);
router.get("/notes/todo/:todoId", getAiNoteByTodo);

export default router;
