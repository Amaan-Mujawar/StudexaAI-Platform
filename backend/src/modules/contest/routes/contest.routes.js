// src/modules/contest/routes/contest.routes.js
import { Router } from "express";
import protect from "../../../middleware/auth.middleware.js";
import {
    getTopics,
    startContest,
    submitContest,
    getLeaderboard,
    getUserContestStats,
    getUserAttempts,
} from "../controllers/contest.controller.js";

const router = Router();

/* All contest routes require authentication */
router.use(protect);

router.get("/topics", getTopics);
router.post("/start", startContest);
router.post("/:attemptId/submit", submitContest);
router.get("/leaderboard", getLeaderboard);
router.get("/me", getUserContestStats);
router.get("/attempts", getUserAttempts);

export default router;
