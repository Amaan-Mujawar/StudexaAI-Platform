// src/features/verbalReasoning/services/verbalReasoning.service.js

import api from "../../../services/api.js";

/**
 * StudexaAI — Verbal Reasoning Service
 * Strict adherence to confirmed backend contract
 */

/**
 * Generate a new verbal reasoning attempt
 */
export const startVerbal = async ({ difficulty, count }) => {
    return api.post("/verbal-reasoning/generate", {
        difficulty,
        count,
    });
};

/**
 * Get the current question for an active attempt
 */
export const getCurrentQuestion = async (attemptId) => {
    return api.get(`/verbal-reasoning/${attemptId}/current`);
};

/**
 * Submit an answer for the current question
 */
export const submitAnswer = async (attemptId, selectedIndex) => {
    return api.post(`/verbal-reasoning/${attemptId}/answer`, {
        selectedIndex,
    });
};

/**
 * Get summary result
 */
export const getVerbalResult = async (attemptId) => {
    return api.get(`/verbal-reasoning/${attemptId}/result`);
};

/**
 * Get detailed review
 */
export const getVerbalReview = async (attemptId) => {
    return api.get(`/verbal-reasoning/${attemptId}/review`);
};

/**
 * Fetch list of recent verbal reasoning attempts
 */
export const getVerbalHistory = async () => {
    return api.get("/verbal-reasoning/history");
};

/**
 * Delete a specific attempt
 */
export const deleteVerbalAttempt = async (attemptId) => {
    return api.delete(`/verbal-reasoning/${attemptId}`);
};

export default {
    startVerbal,
    getCurrentQuestion,
    submitAnswer,
    getVerbalResult,
    getVerbalReview,
    getVerbalHistory,
    deleteVerbalAttempt,
};
