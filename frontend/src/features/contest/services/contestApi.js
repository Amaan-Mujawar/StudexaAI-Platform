// src/features/contest/services/contestApi.js
import api from "../../../services/api.js";

/** Get available topics */
export const fetchTopics = () => api.get("/contest/topics");

/** Start a new contest attempt */
export const startContest = (topic) =>
    api.post("/contest/start", { topic });

/** Submit all answers for an attempt */
export const submitContest = (attemptId, answers) =>
    api.post(`/contest/${attemptId}/submit`, { answers });

/** Fetch global leaderboard */
export const fetchLeaderboard = (limit = 20) =>
    api.get("/contest/leaderboard", { params: { limit } });

/** Fetch current user's contest stats */
export const fetchUserContestStats = () => api.get("/contest/me");

/** Fetch user's past attempts */
export const fetchUserAttempts = (limit = 10) =>
    api.get("/contest/attempts", { params: { limit } });
