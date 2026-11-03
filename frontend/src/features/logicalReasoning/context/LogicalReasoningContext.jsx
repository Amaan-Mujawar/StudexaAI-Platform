// src/features/logicalReasoning/context/LogicalReasoningContext.jsx

import { createContext, useCallback, useEffect, useState } from "react";
import { useSidebarHistory } from "../../../context/SidebarHistoryContext.jsx";
import logicalService from "../services/logicalReasoning.service.js";

export const LogicalReasoningContext = createContext(null);

export const LogicalReasoningProvider = ({ children }) => {
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
      const res = await logicalService.getLogicalHistory();
      const normalized = Array.isArray(res.data) ? res.data : [];
      setHistory(normalized);

      if (normalized.length === 0) {
        showEmptySidebarHistory("Logical Reasoning");
      } else {
        setSidebarHistory({
          title: "Logical Reasoning",
          items: normalized.slice(0, 24).map((record) => ({
            id: record._id || record.id,
            title: record.practiceName || "Logical Practice",
            subtitle: `${record.score || 0}/${record.totalQuestions || 0} • ${record.difficulty}`,
            timestamp: record.completedAt || record.createdAt,
            route: `/dashboard/logical-reasoning/${record._id || record.id}/result`,
          })),
        });
      }
    } catch (err) {
      console.error("[LogicalReasoningContext] loadHistory error:", err);
      showEmptySidebarHistory("Logical Reasoning");
    } finally {
      setLoading(false);
    }
  }, [setSidebarHistory, showEmptySidebarHistory]);

  /**
   * Generate a new logical reasoning session
   */
  const createLogical = async (params) => {
    setGenerating(true);
    try {
      const res = await logicalService.startLogical(params);
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
      await logicalService.deleteLogicalAttempt(id);
      setHistory(prev => prev.filter(q => (q._id || q.id) !== id));
      loadHistory();
    } catch (err) {
      console.error("[LogicalReasoningContext] deleteAttempt error:", err);
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
    createLogical,
    deleteAttempt,
    deletingAttempt,
    setDeletingAttempt,
    refreshHistory: loadHistory,
  };

  return (
    <LogicalReasoningContext.Provider value={value}>
      {children}
    </LogicalReasoningContext.Provider>
  );
};
