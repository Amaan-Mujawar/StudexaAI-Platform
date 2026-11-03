// src/features/verbalReasoning/context/VerbalReasoningContext.jsx

import { createContext, useCallback, useEffect, useState } from "react";
import { useSidebarHistory } from "../../../context/SidebarHistoryContext.jsx";
import verbalService from "../services/verbalReasoning.service.js";

export const VerbalReasoningContext = createContext(null);

export const VerbalReasoningProvider = ({ children }) => {
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
      const res = await verbalService.getVerbalHistory();
      const normalized = Array.isArray(res.data) ? res.data : [];
      setHistory(normalized);

      if (normalized.length === 0) {
        showEmptySidebarHistory("Verbal Reasoning");
      } else {
        setSidebarHistory({
          title: "Verbal Reasoning",
          items: normalized.slice(0, 24).map((record) => ({
            id: record._id || record.id,
            title: record.practiceName || "Verbal Practice",
            subtitle: `${record.score || 0}/${record.totalQuestions || 0} • ${record.difficulty}`,
            timestamp: record.completedAt || record.createdAt,
            route: `/dashboard/verbal-reasoning/${record._id || record.id}/result`,
          })),
        });
      }
    } catch (err) {
      console.error("[VerbalReasoningContext] loadHistory error:", err);
      showEmptySidebarHistory("Verbal Reasoning");
    } finally {
      setLoading(false);
    }
  }, [setSidebarHistory, showEmptySidebarHistory]);

  /**
   * Generate a new verbal reasoning session
   */
  const createVerbal = async (params) => {
    setGenerating(true);
    try {
      const res = await verbalService.startVerbal(params);
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
      await verbalService.deleteVerbalAttempt(id);
      setHistory(prev => prev.filter(q => (q._id || q.id) !== id));
      loadHistory();
    } catch (err) {
      console.error("[VerbalReasoningContext] deleteAttempt error:", err);
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
    createVerbal,
    deleteAttempt,
    deletingAttempt,
    setDeletingAttempt,
    refreshHistory: loadHistory,
  };

  return (
    <VerbalReasoningContext.Provider value={value}>
      {children}
    </VerbalReasoningContext.Provider>
  );
};
