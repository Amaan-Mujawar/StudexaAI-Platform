// src/features/aiQuiz/services/aiQuiz.service.js

import api from "../../../services/api.js";

/**
 * StudexaAI — AI Quiz Service
 * Strict adherence to backend contract
 */

/**
 * Generate a new quiz attempt
 * @param {Object} params
 * @param {string} params.topic
 * @param {number} params.count
 * @param {string} params.difficulty
 */
export const startQuiz = async ({
    topic,
    count,
    difficulty,
    todoId = null,
    noteId = null,
}) => {
    return api.post("/quiz/generate", {
        topic,
        count,
        difficulty,
        todoId,
        noteId,
    });
};

/**
 * Get the current question for an active attempt
 * @param {string} attemptId
 */
export const getCurrentQuestion = async (attemptId) => {
    return api.get(`/quiz/${attemptId}/current`);
};

/**
 * Submit an answer for the current question
 * @param {string} attemptId
 * @param {number} selectedIndex
 */
export const submitAnswer = async (attemptId, selectedIndex) => {
    return api.post(`/quiz/${attemptId}/answer`, {
        selectedIndex,
    });
};

/**
 * Get summary result after quiz completion
 * @param {string} attemptId
 */
export const getQuizResult = async (attemptId) => {
    return api.get(`/quiz/${attemptId}/result`);
};

/**
 * Get detailed review (questions + explanations) after completion
 * @param {string} attemptId
 */
export const getQuizReview = async (attemptId) => {
    return api.get(`/quiz/${attemptId}/review`);
};

/**
 * Fetch list of recent quiz attempts for this user
 */
export const getQuizHistory = async () => {
    return api.get("/quiz/history");
};

/**
 * Delete a specific quiz attempt from history
 * @param {string} attemptId
 */
export const deleteQuizAttempt = async (attemptId) => {
    return api.delete(`/quiz/${attemptId}`);
};

export default {
    startQuiz,
    getCurrentQuestion,
    submitAnswer,
    getQuizResult,
    getQuizReview,
    getQuizHistory,
    deleteQuizAttempt,
};
