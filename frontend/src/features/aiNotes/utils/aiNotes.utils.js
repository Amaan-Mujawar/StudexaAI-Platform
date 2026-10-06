// src/features/aiNotes/utils/aiNotes.utils.js

/* =====================================================
   AI NOTES UTILS
   ✅ strict validation + safe coercion
   ✅ backend-compatible shape
   ✅ centralized normalizer (BACKEND = SOURCE OF TRUTH)
===================================================== */

/**
 * Normalize AI note from backend
 * Backend returns notes with:
 * - _id
 * - subject
 * - answer
 * - mode
 * - createdAt
 * - updatedAt (optional)
 * - linkedQuiz (optional)
 *
 * Normalize to safe UI object.
 */
export const normalizeAiNote = (raw) => {
    const note = raw && typeof raw === "object" ? raw : {};

    const _id = typeof note._id === "string" ? note._id : "";
    const subject = typeof note.subject === "string" ? note.subject : "";
    const answer = typeof note.answer === "string" ? note.answer : "";
    const mode = typeof note.mode === "string" ? note.mode : "short";
    const createdAt = typeof note.createdAt === "string" ? note.createdAt : null;
    const updatedAt = typeof note.updatedAt === "string" ? note.updatedAt : null;
    const linkedQuiz = note.linkedQuiz ?? null;

    return {
        _id,
        subject,
        answer,
        mode,
        createdAt,
        updatedAt,
        linkedQuiz,
    };
};

/**
 * Format date for display
 */
export const formatNoteDate = (iso) => {
    if (!iso) return "";

    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return "";

    return d.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

/**
 * Format mode for display
 */
export const formatNoteMode = (mode) => {
    if (mode === "detailed") return "Detailed";
    if (mode === "short") return "Short";
    return mode || "Short";
};
