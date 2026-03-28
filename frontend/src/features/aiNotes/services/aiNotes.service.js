// src/features/aiNotes/services/aiNotes.service.js

import api from "../../../services/api.js";

/* =====================================================
   AI NOTES SERVICE — Frontend Contract Layer
   - NO endpoint changes
   - Mirrors backend behavior exactly
   - Single responsibility: network only
===================================================== */

/**
 * Fetch all AI notes
 * @returns {Promise<Array>}
 */
export const fetchAiNotes = async () => {
    const res = await api.get("/ai/notes");
    return res.data;
};

/**
 * Generate a new AI note
 * @param {{ topic: string, level: string }} payload
 * @returns {Promise<Object>}
 */
export const generateAiNote = async (payload) => {
    const res = await api.post("/ai/notes", payload);
    return res.data;
};

/**
 * Delete an AI note
 * @param {string} id
 * @returns {Promise<{ message: string }>}
 */
export const deleteAiNote = async (id) => {
    const res = await api.delete(`/ai/notes/${id}`);
    return res.data;
};

/**
 * Regenerate an AI note
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const regenerateAiNote = async (id) => {
    const res = await api.post(`/ai/notes/${id}/regenerate`);
    return res.data;
};

export default {
    fetchAiNotes,
    generateAiNote,
    deleteAiNote,
    regenerateAiNote,
};
