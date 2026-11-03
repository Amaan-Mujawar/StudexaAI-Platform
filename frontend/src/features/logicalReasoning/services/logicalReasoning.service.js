// src/features/logicalReasoning/services/logicalReasoning.service.js

import api from "../../../services/api.js";

/**
 * StudexaAI — Logical Reasoning Service
 * Strict adherence to confirmed backend contract
 */

/**
 * Generate a new logical reasoning attempt
 */
export const startLogical = async ({ difficulty, count }) => {
    return api.post("/logical-reasoning/generate", {
        difficulty,
        count,
    });
};

/**
 * Get the current question for an active attempt
 */
export const getCurrentQuestion = async (attemptId) => {
    return api.get(`/logical-reasoning/${attemptId}/current`);
};

/**
 * Submit an answer for the current question
 */
export const submitAnswer = async (attemptId, selectedIndex) => {
    return api.post(`/logical-reasoning/${attemptId}/answer`, {
        selectedIndex,
    });
};

/**
 * Get summary result
 */
export const getLogicalResult = async (attemptId) => {
    return api.get(`/logical-reasoning/${attemptId}/result`);
};

/**
 * Get detailed review
 */
export const getLogicalReview = async (attemptId) => {
    return api.get(`/logical-reasoning/${attemptId}/review`);
};

/**
 * Fetch list of recent logical reasoning attempts
 */
export const getLogicalHistory = async () => {
    return api.get("/logical-reasoning/history");
};

/**
 * Delete a specific attempt
 */
export const deleteLogicalAttempt = async (attemptId) => {
    return api.delete(`/logical-reasoning/${attemptId}`);
};

export default {
    startLogical,
    getCurrentQuestion,
    submitAnswer,
    getLogicalResult,
    getLogicalReview,
    getLogicalHistory,
    deleteLogicalAttempt,
};
