// src/features/aptitude/services/aptitude.service.js

import api from "../../../services/api.js";

/**
 * StudexaAI — Aptitude Service
 * Strict adherence to confirmed backend contract
 */

/**
 * Generate a new aptitude attempt
 */
export const startAptitude = async ({ difficulty, count }) => {
    return api.post("/aptitude/generate", {
        difficulty,
        count,
    });
};

/**
 * Get the current question for an active attempt
 */
export const getCurrentQuestion = async (attemptId) => {
    return api.get(`/aptitude/${attemptId}/current`);
};

/**
 * Submit an answer for the current question
 */
export const submitAnswer = async (attemptId, selectedIndex) => {
    return api.post(`/aptitude/${attemptId}/answer`, {
        selectedIndex,
    });
};

/**
 * Get summary result
 */
export const getAptitudeResult = async (attemptId) => {
    return api.get(`/aptitude/${attemptId}/result`);
};

/**
 * Get detailed review
 */
export const getAptitudeReview = async (attemptId) => {
    return api.get(`/aptitude/${attemptId}/review`);
};

/**
 * Fetch list of recent aptitude attempts
 */
export const getAptitudeHistory = async () => {
    return api.get("/aptitude/history");
};

/**
 * Delete a specific attempt
 */
export const deleteAptitudeAttempt = async (attemptId) => {
    return api.delete(`/aptitude/${attemptId}`);
};

export default {
    startAptitude,
    getCurrentQuestion,
    submitAnswer,
    getAptitudeResult,
    getAptitudeReview,
    getAptitudeHistory,
    deleteAptitudeAttempt,
};
