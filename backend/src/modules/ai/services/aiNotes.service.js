// src/modules/ai/services/aiNotes.service.js
import getGroqClient from "../../../utils/groqClient.js";

import AiNote from "../models/AiNote.js";
import Todo from "../../todos/models/Todo.js";

import {
  AI_MODELS,
  buildAiNotePrompt,
  buildAiNoteFromTodoPrompt,
  buildAiNoteRegeneratePrompt,
} from "../../common/constants/ai.prompts.js";

import { unlinkQuizAttemptsFromNote } from "../utils/ai.integration.utils.js";

/* =====================================================
   HELPERS
===================================================== */
const throwError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

/* =====================================================
   AI NOTES SERVICE
===================================================== */

/**
 * Generate AI Note (topic based)
 * POST /api/ai/notes
 */
export const generateAiNoteService = async ({
  userId,
  topic,
  level = "short",
}) => {
  const cleanTopic = typeof topic === "string" ? topic.trim() : "";

  if (!cleanTopic) {
    throwError("Topic is required", 400);
  }

  const groq = getGroqClient();

  try {
    const prompt = buildAiNotePrompt({ topic: cleanTopic, level });

    const completion = await groq.chat.completions.create({
      model: AI_MODELS.DEFAULT,
      temperature: 0.4,
      messages: [
        { role: "system", content: "You are a helpful academic assistant." },
        { role: "user", content: prompt },
      ],
    });

    const answer = completion?.choices?.[0]?.message?.content || "";

    if (!answer || typeof answer !== "string") {
      throwError("AI request failed", 500);
    }

    const note = await AiNote.create({
      user: userId,
      subject: cleanTopic,
      answer,
      mode: level === "detailed" ? "detailed" : "short",
      linkedTodo: null,
      linkedQuiz: null,
    });

    return note;
  } catch {
    throwError("AI request failed", 500);
  }
};

/**
 * Regenerate AI Note by noteId
 * POST /api/ai/notes/:id/regenerate
 */
export const regenerateAiNoteService = async ({ userId, noteId }) => {
  const note = await AiNote.findOne({
    _id: noteId,
    user: userId,
    deletedAt: null,
  });

  if (!note) {
    throwError("Note not found", 404);
  }

  const groq = getGroqClient();

  try {
    const prompt = buildAiNoteRegeneratePrompt({
      subject: note.subject,
      mode: note.mode,
    });

    const completion = await groq.chat.completions.create({
      model: AI_MODELS.DEFAULT,
      temperature: 0.6,
      messages: [
        { role: "system", content: "You are a helpful academic assistant." },
        { role: "user", content: prompt },
      ],
    });

    const answer = completion?.choices?.[0]?.message?.content || "";
    if (!answer || typeof answer !== "string") {
      throwError("AI request failed", 500);
    }

    note.answer = answer;
    await note.save();

    return note;
  } catch {
    throwError("AI request failed", 500);
  }
};

/**
 * Get notes (legacy – unchanged)
 * GET /api/ai/notes
 */
export const getAiNotesService = async ({ userId }) => {
  const notes = await AiNote.find({
    user: userId,
    deletedAt: null,
  }).sort({ createdAt: -1 });

  return notes;
};

/**
 * Delete note (soft delete + safe unlink)
 * DELETE /api/ai/notes/:id
 */
export const deleteAiNoteService = async ({ userId, noteId }) => {
  const note = await AiNote.findOne({
    _id: noteId,
    user: userId,
    deletedAt: null,
  });

  if (!note) {
    throwError("Note not found", 404);
  }

  await unlinkQuizAttemptsFromNote({ noteId: note._id });

  note.deletedAt = new Date();
  await note.save();

  return { message: "Note deleted successfully" };
};

/**
 * Generate AI note from todo
 * POST /api/ai/todos/:todoId/note
 */
export const generateAiNoteFromTodoService = async ({ userId, todoId }) => {
  const todo = await Todo.findOne({
    _id: todoId,
    user: userId,
  });

  if (!todo) {
    throwError("Todo not found", 404);
  }

  const existingNote = await AiNote.findOne({
    user: userId,
    linkedTodo: todo._id,
    deletedAt: null,
  });

  if (existingNote) {
    return { note: existingNote, isExisting: true };
  }

  const groq = getGroqClient();

  try {
    const prompt = buildAiNoteFromTodoPrompt({ todoTitle: todo.title });

    const completion = await groq.chat.completions.create({
      model: AI_MODELS.DEFAULT,
      temperature: 0.5,
      messages: [
        { role: "system", content: "You are a helpful academic assistant." },
        { role: "user", content: prompt },
      ],
    });

    const answer = completion?.choices?.[0]?.message?.content || "";
    if (!answer || typeof answer !== "string") {
      throwError("AI request failed", 500);
    }

    const note = await AiNote.create({
      user: userId,
      subject: todo.title,
      answer,
      mode: "detailed",
      linkedTodo: todo._id,
      linkedQuiz: null,
    });

    return { note, isExisting: false };
  } catch {
    throwError("AI request failed", 500);
  }
};

/**
 * Regenerate AI note from todo
 * POST /api/ai/todos/:todoId/note/regenerate
 */
export const regenerateAiNoteFromTodoService = async ({ userId, todoId }) => {
  const note = await AiNote.findOne({
    user: userId,
    linkedTodo: todoId,
    deletedAt: null,
  });

  if (!note) {
    throwError("No AI note linked to this Todo", 404);
  }

  const groq = getGroqClient();

  try {
    const prompt = buildAiNoteRegeneratePrompt({
      subject: note.subject,
      mode: note.mode,
    });

    const completion = await groq.chat.completions.create({
      model: AI_MODELS.DEFAULT,
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a helpful academic assistant." },
        { role: "user", content: prompt },
      ],
    });

    const answer = completion?.choices?.[0]?.message?.content || "";
    if (!answer || typeof answer !== "string") {
      throwError("AI request failed", 500);
    }

    note.answer = answer;
    await note.save();

    return note;
  } catch {
    throwError("AI request failed", 500);
  }
};

/**
 * Get AI note by todoId
 * GET /api/ai/notes/todo/:todoId
 */
export const getAiNoteByTodoService = async ({ userId, todoId }) => {
  const note = await AiNote.findOne({
    user: userId,
    linkedTodo: todoId,
    deletedAt: null,
  });

  if (!note) {
    throwError("No AI note for this todo", 404);
  }

  return note;
};

export default {
  generateAiNoteService,
  regenerateAiNoteService,
  getAiNotesService,
  deleteAiNoteService,
  generateAiNoteFromTodoService,
  regenerateAiNoteFromTodoService,
  getAiNoteByTodoService,
};
