// src/modules/contest/utils/scoringUtils.js

export const DIFFICULTY_MULTIPLIER = {
    easy: 1,
    medium: 1.5,
    hard: 2,
};

export const BASE_POINTS = 100;
export const MAX_TIME_SECS = 30;

/**
 * Calculate points for a single correct answer.
 *  - Wrong answer → 0
 *  - Time bonus: faster = more points (speed ratio 0–1)
 *  - Final range:
 *      easy   → 50–100
 *      medium → 75–150
 *      hard   → 100–200
 *
 * @param {string}  difficulty    - 'easy' | 'medium' | 'hard'
 * @param {number}  timeTakenSecs - seconds taken (clamped 0–30)
 * @param {boolean} isCorrect
 * @returns {number} integer points
 */
export const calcPoints = (difficulty, timeTakenSecs, isCorrect) => {
    if (!isCorrect) return 0;

    const multiplier = DIFFICULTY_MULTIPLIER[difficulty] ?? 1;
    const elapsed = Math.max(0, Math.min(timeTakenSecs, MAX_TIME_SECS));
    const speedRatio = (MAX_TIME_SECS - elapsed) / MAX_TIME_SECS; // 1 = instant, 0 = full time used
    const score = BASE_POINTS * multiplier * (0.5 + 0.5 * speedRatio);
    return Math.round(score);
};

/**
 * Badge definitions.
 * Each badge has:
 *  - id     : unique string key stored on the user
 *  - name   : display name
 *  - check  : (attempt, user) => boolean
 */
export const BADGE_DEFINITIONS = [
    {
        id: "first_win",
        name: "First Victory",
        check: (_attempt, user) => (user.totalContestPoints ?? 0) === 0, // awarded before points are added
    },
    {
        id: "dsa_master",
        name: "DSA Master",
        check: (attempt) =>
            attempt.topic === "DSA" &&
            attempt.correctCount / attempt.questions.length >= 0.9,
    },
    {
        id: "oop_master",
        name: "OOP Master",
        check: (attempt) =>
            attempt.topic === "OOPs" &&
            attempt.correctCount / attempt.questions.length >= 0.9,
    },
    {
        id: "sql_master",
        name: "SQL Master",
        check: (attempt) =>
            attempt.topic === "SQL" &&
            attempt.correctCount / attempt.questions.length >= 0.9,
    },
    {
        id: "streak_7",
        name: "7-Day Streak",
        check: (_attempt, user) => (user.contestStreak ?? 0) >= 7,
    },
    {
        id: "streak_30",
        name: "30-Day Streak",
        check: (_attempt, user) => (user.contestStreak ?? 0) >= 30,
    },
];

/**
 * Returns the list of badges to newly award for a completed attempt.
 * Already-owned badges are excluded.
 *
 * @param {Object} attempt   - populated ContestAttempt document
 * @param {Object} user      - User document (before points update)
 * @returns {Array<{id, name}>}
 */
export const computeNewBadges = (attempt, user) => {
    const owned = new Set((user.badges ?? []).map((b) => b.id));
    return BADGE_DEFINITIONS.filter(
        (badge) => !owned.has(badge.id) && badge.check(attempt, user)
    ).map(({ id, name }) => ({ id, name }));
};
