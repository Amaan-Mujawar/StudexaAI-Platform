// src/modules/contest/controllers/contest.controller.js
import asyncHandler from "../../../utils/asyncHandler.js";
import {
    getTopicsService,
    startContestService,
    submitContestService,
    getLeaderboardService,
    getUserContestStatsService,
    getUserAttemptsService,
} from "../services/contest.service.js";

/* =====================================================
   CONTEST CONTROLLER
   All scoring / validation happens server-side in
   contest.service.js — the client only sends answers.
===================================================== */

/* GET /api/contest/topics */
export const getTopics = asyncHandler(async (req, res) => {
    const data = getTopicsService();
    res.json(data);
});

/* POST /api/contest/start  body: { topic } */
export const startContest = asyncHandler(async (req, res) => {
    const { topic } = req.body;
    const attempt = await startContestService(req.user._id, topic);

    /* Strip correctIndex before sending to client */
    const safeAttempt = {
        ...attempt.toObject(),
        questions: attempt.questions.map((q) => ({
            questionId: q.questionId,
            question: q.question,
            options: q.options,
            difficulty: q.difficulty,
            // correctIndex intentionally omitted
        })),
    };

    res.status(201).json({ message: "Contest started", attempt: safeAttempt });
});

/* POST /api/contest/:attemptId/submit  body: { answers: [{questionIndex, selectedIndex, timeTakenSecs}] } */
export const submitContest = asyncHandler(async (req, res) => {
    const { attemptId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
        return res.status(400).json({ message: "answers must be an array" });
    }

    /* req.io is attached in server.js so the service can emit socket events */
    const result = await submitContestService(
        req.user._id,
        attemptId,
        answers,
        req.io
    );

    res.json({ message: "Contest submitted", ...result });
});

/* GET /api/contest/leaderboard */
export const getLeaderboard = asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const leaderboard = await getLeaderboardService(limit);
    res.json({ leaderboard });
});

/* GET /api/contest/me */
export const getUserContestStats = asyncHandler(async (req, res) => {
    const stats = await getUserContestStatsService(req.user._id);
    res.json(stats);
});

/* GET /api/contest/attempts */
export const getUserAttempts = asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const attempts = await getUserAttemptsService(req.user._id, limit);
    res.json({ attempts });
});

export default {
    getTopics,
    startContest,
    submitContest,
    getLeaderboard,
    getUserContestStats,
    getUserAttempts,
};
