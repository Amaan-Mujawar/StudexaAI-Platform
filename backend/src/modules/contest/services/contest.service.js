// src/modules/contest/services/contest.service.js
import ContestQuestion from "../models/ContestQuestion.js";
import ContestAttempt from "../models/ContestAttempt.js";
import User from "../../auth/models/User.js";
import { calcPoints, computeNewBadges } from "../utils/scoringUtils.js";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */

/** Fisher-Yates shuffle — returns a new shuffled array */
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const TOPICS = ["DSA", "OOPs", "SQL"];
const QUESTIONS_PER_CONTEST = 10;

/* ─────────────────────────────────────────
   1. Get available topics
───────────────────────────────────────── */
export const getTopicsService = () => ({
    topics: TOPICS,
});

/* ─────────────────────────────────────────
   2. Start a new contest attempt
───────────────────────────────────────── */
export const startContestService = async (userId, topic) => {
    if (!TOPICS.includes(topic)) {
        const err = new Error(`Invalid topic: ${topic}`);
        err.statusCode = 400;
        throw err;
    }

    /* Fetch all active questions for the topic */
    const pool = await ContestQuestion.find({ topic, isActive: true }).lean();

    if (pool.length < 1) {
        const err = new Error(
            `No active questions found for topic "${topic}". Please seed the database first.`
        );
        err.statusCode = 404;
        throw err;
    }

    /* Pick up to QUESTIONS_PER_CONTEST questions, shuffled */
    const picked = shuffle(pool).slice(0, QUESTIONS_PER_CONTEST);

    /* Build immutable snapshot (do NOT include correctIndex yet — it's stripped on the API response) */
    const questions = picked.map((q) => ({
        questionId: q._id,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex, // stored server-side only
        difficulty: q.difficulty,
    }));

    const attempt = await ContestAttempt.create({
        user: userId,
        topic,
        questions,
        startedAt: new Date(),
    });

    return attempt;
};

/* ─────────────────────────────────────────
   3. Submit contest answers (server-side scoring)
───────────────────────────────────────── */
export const submitContestService = async (userId, attemptId, answers, io) => {
    /* Load attempt and make sure it belongs to this user */
    const attempt = await ContestAttempt.findOne({
        _id: attemptId,
        user: userId,
        completed: false,
    });

    if (!attempt) {
        const err = new Error("Contest attempt not found or already completed.");
        err.statusCode = 404;
        throw err;
    }

    /* Load user (needed for streak + badge calc) */
    const user = await User.findById(userId);
    if (!user) {
        const err = new Error("User not found.");
        err.statusCode = 404;
        throw err;
    }

    /* ── Score each answer server-side ── */
    let totalPoints = 0;
    let correctCount = 0;

    const scoredAnswers = attempt.questions.map((q, idx) => {
        const submitted = answers.find((a) => a.questionIndex === idx);
        const selectedIndex = submitted?.selectedIndex ?? -1;
        const timeTakenSecs = Math.max(
            0,
            Math.min(submitted?.timeTakenSecs ?? 30, 30)
        );

        const isCorrect =
            selectedIndex >= 0 && selectedIndex === q.correctIndex;
        const pts = calcPoints(q.difficulty, timeTakenSecs, isCorrect);

        if (isCorrect) correctCount++;
        totalPoints += pts;

        return {
            questionIndex: idx,
            selectedIndex,
            isCorrect,
            timeTakenSecs,
            pointsAwarded: pts,
        };
    });

    /* ── Populate attempt fields before badge check ── */
    attempt.answers = scoredAnswers;
    attempt.totalPoints = totalPoints;
    attempt.correctCount = correctCount;
    attempt.completed = true;
    attempt.completedAt = new Date();

    /* ── Streak calculation ── */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreak = user.contestStreak ?? 0;

    if (user.lastContestDate) {
        const last = new Date(user.lastContestDate);
        last.setHours(0, 0, 0, 0);
        const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            /* Same day — streak unchanged */
        } else if (diffDays === 1) {
            newStreak += 1; /* Consecutive day */
        } else {
            newStreak = 1; /* Broken streak */
        }
    } else {
        newStreak = 1; /* First contest ever */
    }

    /* Apply updated streak to user (needed for badge check) */
    user.contestStreak = newStreak;

    /* ── Badge check (before totalPoints is incremented) ── */
    const newBadges = computeNewBadges(attempt, user);
    attempt.newBadges = newBadges;

    /* ── Persist attempt ── */
    await attempt.save();

    /* ── Update user: points, streak, date, badges ── */
    const badgeUpdates = newBadges.map((b) => ({
        id: b.id,
        name: b.name,
        awardedAt: new Date(),
    }));

    await User.findByIdAndUpdate(userId, {
        $inc: { totalContestPoints: totalPoints },
        $set: {
            contestStreak: newStreak,
            lastContestDate: new Date(),
        },
        ...(badgeUpdates.length > 0
            ? { $push: { badges: { $each: badgeUpdates } } }
            : {}),
    });

    /* ── Emit real-time leaderboard update if Socket.io is available ── */
    if (io) {
        const leaderboard = await getLeaderboardService(20);
        io.emit("leaderboard:update", { leaderboard });
    }

    return {
        attemptId: attempt._id,
        totalPoints,
        correctCount,
        totalQuestions: attempt.questions.length,
        answers: scoredAnswers,
        newBadges,
        streak: newStreak,
    };
};

/* ─────────────────────────────────────────
   4. Get global leaderboard (top N users)
───────────────────────────────────────── */
export const getLeaderboardService = async (limit = 20) => {
    const users = await User.find({ totalContestPoints: { $gt: 0 } })
        .sort({ totalContestPoints: -1 })
        .limit(limit)
        .select("name totalContestPoints contestStreak badges")
        .lean();

    return users.map((u, i) => ({
        rank: i + 1,
        userId: u._id,
        name: u.name,
        totalContestPoints: u.totalContestPoints,
        contestStreak: u.contestStreak,
        badges: u.badges ?? [],
    }));
};

/* ─────────────────────────────────────────
   5. Get current user's contest stats
───────────────────────────────────────── */
export const getUserContestStatsService = async (userId) => {
    const user = await User.findById(userId)
        .select("name totalContestPoints contestStreak lastContestDate badges")
        .lean();

    if (!user) {
        const err = new Error("User not found.");
        err.statusCode = 404;
        throw err;
    }

    /* Global rank */
    const rank =
        (await User.countDocuments({
            totalContestPoints: { $gt: user.totalContestPoints },
        })) + 1;

    return {
        name: user.name,
        totalContestPoints: user.totalContestPoints ?? 0,
        contestStreak: user.contestStreak ?? 0,
        lastContestDate: user.lastContestDate,
        badges: user.badges ?? [],
        rank,
    };
};

/* ─────────────────────────────────────────
   6. Get user's past contest attempts
───────────────────────────────────────── */
export const getUserAttemptsService = async (userId, limit = 10) => {
    const attempts = await ContestAttempt.find({ user: userId, completed: true })
        .sort({ completedAt: -1 })
        .limit(limit)
        .select(
            "topic totalPoints correctCount questions completedAt newBadges"
        )
        .lean();

    return attempts.map((a) => ({
        attemptId: a._id,
        topic: a.topic,
        totalPoints: a.totalPoints,
        correctCount: a.correctCount,
        totalQuestions: a.questions.length,
        accuracy:
            a.questions.length > 0
                ? Math.round((a.correctCount / a.questions.length) * 100)
                : 0,
        completedAt: a.completedAt,
        newBadges: a.newBadges ?? [],
    }));
};
