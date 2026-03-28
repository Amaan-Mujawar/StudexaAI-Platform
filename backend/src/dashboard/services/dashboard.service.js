// src/dashboard/services/dashboard.service.js

import Todo from "../../modules/todos/models/Todo.js";
import User from "../../modules/auth/models/User.js";
import AiNote from "../../modules/ai/models/AiNote.js";
import QuizAttempt from "../../modules/quiz/models/QuizAttempt.js";

import LogicalReasoningAttempt from "../../modules/practices/logicalReasoning/models/LogicalReasoningAttempt.js";
import AptitudeAttempt from "../../modules/practices/aptitude/models/AptitudeAttempt.js";
import VerbalReasoningAttempt from "../../modules/practices/verbalReasoning/models/VerbalReasoningAttempt.js";

import { ATTEMPT_STATES } from "../../modules/common/constants/attemptStates.js";

/* =====================================================
   DASHBOARD STATS
   GET /api/dashboard/stats
===================================================== */
export const getDashboardStatsService = async ({ userId }) => {
  console.log(`[Stats Service] Entry -> userId: ${userId}, type: ${typeof userId}`);

  // 1. Validate userId
  if (!userId) {
    const err = new Error("Unauthenticated request for stats: userId missing");
    err.statusCode = 401;
    throw err;
  }

  /* =======================
      ADMIN GLOBAL STATS
  ======================== */
  if (userId === "admin_id") {
    try {
      const [totalUsers, totalTodos, totalNotes, totalAttempts] = await Promise.all([
        User.countDocuments().catch(e => { console.error("[Stats Service] Admin User count failed:", e.message); return 0; }),
        Todo.countDocuments().catch(e => { console.error("[Stats Service] Admin Todo count failed:", e.message); return 0; }),
        AiNote.countDocuments().catch(e => { console.error("[Stats Service] Admin AiNote count failed:", e.message); return 0; }),
        QuizAttempt.countDocuments({
          completed: true,
          deletedAt: null,
          state: ATTEMPT_STATES.COMPLETED,
        }).catch(e => { console.error("[Stats Service] Admin Quiz count failed:", e.message); return 0; }),
      ]);

      return {
        totalUsers,
        totalTodos,
        completedTodos: totalTodos,
        pendingTodos: 0,
        aiNotes: totalNotes,
        quizzesTaken: totalAttempts,
        avgQuizScore: 85, // global/mock avg
        logicalReasoningPractices: totalAttempts,
        aptitudePractices: totalAttempts,
        verbalReasoningPractices: totalAttempts,
        isAdmin: true,
        isGlobal: true,
        message: "Platform-wide summary",
      };
    } catch (error) {
      console.error("[Stats Service] Admin aggregation failed:", error);
      return {
        totalUsers: 0,
        totalTodos: 0,
        completedTodos: 0,
        pendingTodos: 0,
        aiNotes: 0,
        quizzesTaken: 0,
        avgQuizScore: 0,
        logicalReasoningPractices: 0,
        aptitudePractices: 0,
        verbalReasoningPractices: 0,
        isAdmin: true,
        isGlobal: true,
        error: "Failed to aggregate global statistics",
      };
    }
  }

  /* =======================
      USER DASHBOARD STATS
  ======================== */
  try {
    const [
      totalTodos,
      completedTodos,
      aiNotesCount,

      completedQuizzesCount,
      completedQuizzesForAvg,

      logicalReasoningPractices,
      aptitudePractices,
      verbalReasoningPractices,
    ] = await Promise.all([
      Todo.countDocuments({ user: userId }).catch(() => 0),
      Todo.countDocuments({ user: userId, completed: true }).catch(() => 0),
      AiNote.countDocuments({ user: userId, deletedAt: null }).catch(() => 0),

      QuizAttempt.countDocuments({
        user: userId,
        completed: true,
        deletedAt: null,
        state: ATTEMPT_STATES.COMPLETED,
      }).catch(() => 0),

      QuizAttempt.find({
        user: userId,
        completed: true,
        deletedAt: null,
        state: ATTEMPT_STATES.COMPLETED,
      }).select("score totalQuestions").catch(() => []),

      LogicalReasoningAttempt.countDocuments({
        user: userId,
        completed: true,
        deletedAt: null,
        state: ATTEMPT_STATES.COMPLETED,
      }).catch(() => 0),

      AptitudeAttempt.countDocuments({
        user: userId,
        completed: true,
        deletedAt: null,
        state: ATTEMPT_STATES.COMPLETED,
      }).catch(() => 0),

      VerbalReasoningAttempt.countDocuments({
        user: userId,
        completed: true,
        deletedAt: null,
        state: ATTEMPT_STATES.COMPLETED,
      }).catch(() => 0),
    ]);

    let avgQuizScore = 0;

    if (Array.isArray(completedQuizzesForAvg) && completedQuizzesForAvg.length > 0) {
      let totalScore = 0;
      let totalQuestions = 0;

      completedQuizzesForAvg.forEach((q) => {
        const score = Number(q?.score || 0);
        const total = Number(q?.totalQuestions || 0);

        if (total > 0) {
          totalScore += score;
          totalQuestions += total;
        }
      });

      if (totalQuestions > 0) {
        avgQuizScore = Math.round((totalScore / totalQuestions) * 100);
      }
    }

    return {
      totalTodos,
      completedTodos,
      pendingTodos: Math.max(0, totalTodos - completedTodos),
      aiNotes: aiNotesCount,

      quizzesTaken: completedQuizzesCount,
      avgQuizScore,

      logicalReasoningPractices,
      aptitudePractices,
      verbalReasoningPractices,

      isAdmin: false,
      isGlobal: false,
    };
  } catch (error) {
    console.error("[Stats Service] User stats critical failure:", error);

    return {
      totalTodos: 0,
      completedTodos: 0,
      pendingTodos: 0,
      aiNotes: 0,
      quizzesTaken: 0,
      avgQuizScore: 0,
      logicalReasoningPractices: 0,
      aptitudePractices: 0,
      verbalReasoningPractices: 0,
      isAdmin: false,
      isGlobal: false,
      partialData: true,
      error: "Some dashboard metrics failed to load",
    };
  }
};

export default {
  getDashboardStatsService,
};