// src/features/aiQuiz/context/AiQuizContext.jsx

import { createContext, useCallback, useEffect, useState } from "react";
import { useSidebarHistory } from "../../../context/SidebarHistoryContext.jsx";
import quizService from "../services/aiQuiz.service.js";

export const AiQuizContext = createContext(null);

export const AiQuizProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [deletingAttempt, setDeletingAttempt] = useState(null);
  
  const { setSidebarHistory, showEmptySidebarHistory } = useSidebarHistory();

  /**
   * Load history and update sidebar
   */
  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quizService.getQuizHistory();
      const normalized = Array.isArray(res.data) ? res.data : [];
      setHistory(normalized);

      if (normalized.length === 0) {
        showEmptySidebarHistory("AI Quizzes");
      } else {
        setSidebarHistory({
          title: "AI Quizzes",
          items: normalized.slice(0, 24).map((q) => ({
            id: q._id || q.id,
            title: q.topic || "Untitled Quiz",
            subtitle: `${q.score || 0}/${q.totalQuestions || 0} • ${q.difficulty}`,
            timestamp: q.completedAt || q.createdAt,
            route: `/dashboard/ai-quiz/${q._id || q.id}/result`,
          })),
        });
      }
    } catch (err) {
      console.error("[AiQuizContext] loadHistory error:", err);
      showEmptySidebarHistory("AI Quizzes");
    } finally {
      setLoading(false);
    }
  }, [setSidebarHistory, showEmptySidebarHistory]);

  /**
   * Generate a new quiz
   */
  const createQuiz = async (params) => {
    setGenerating(true);
    try {
      const res = await quizService.startQuiz(params);
      // Wait a bit to refresh history so the new attempt (if completed instantly by backend, though unlikely) shows
      // Actually usually we just navigate to the new attemptId
      return res.data; 
    } finally {
      setGenerating(false);
    }
  };

  /**
   * Delete an attempt
   */
  const deleteAttempt = async (id) => {
    try {
      await quizService.deleteQuizAttempt(id);
      setHistory(prev => prev.filter(q => (q._id || q.id) !== id));
      // Update sidebar
      loadHistory();
    } catch (err) {
      console.error("[AiQuizContext] deleteAttempt error:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const value = {
    history,
    loading,
    generating,
    createQuiz,
    deleteAttempt,
    deletingAttempt,
    setDeletingAttempt,
    refreshHistory: loadHistory,
  };

  return (
    <AiQuizContext.Provider value={value}>
      {children}
    </AiQuizContext.Provider>
  );
};
