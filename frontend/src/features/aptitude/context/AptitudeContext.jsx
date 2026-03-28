// src/features/aptitude/context/AptitudeContext.jsx

import { createContext, useCallback, useEffect, useState } from "react";
import { useSidebarHistory } from "../../../context/SidebarHistoryContext.jsx";
import aptitudeService from "../services/aptitude.service.js";

export const AptitudeContext = createContext(null);

export const AptitudeProvider = ({ children }) => {
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
      const res = await aptitudeService.getAptitudeHistory();
      const normalized = Array.isArray(res.data) ? res.data : [];
      setHistory(normalized);

      if (normalized.length === 0) {
        showEmptySidebarHistory("Aptitude History");
      } else {
        setSidebarHistory({
          title: "Aptitude History",
          items: normalized.slice(0, 24).map((record) => ({
            id: record._id || record.id,
            title: record.practiceName || "Aptitude Practice",
            subtitle: `${record.score || 0}/${record.totalQuestions || 0} • ${record.difficulty}`,
            timestamp: record.completedAt || record.createdAt,
            route: `/dashboard/aptitude/${record._id || record.id}/result`,
          })),
        });
      }
    } catch (err) {
      console.error("[AptitudeContext] loadHistory error:", err);
      showEmptySidebarHistory("Aptitude History");
    } finally {
      setLoading(false);
    }
  }, [setSidebarHistory, showEmptySidebarHistory]);

  /**
   * Generate a new aptitude session
   */
  const createAptitude = async (params) => {
    setGenerating(true);
    try {
      const res = await aptitudeService.startAptitude(params);
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
      await aptitudeService.deleteAptitudeAttempt(id);
      setHistory(prev => prev.filter(q => (q._id || q.id) !== id));
      loadHistory();
    } catch (err) {
      console.error("[AptitudeContext] deleteAttempt error:", err);
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
    createAptitude,
    deleteAttempt,
    deletingAttempt,
    setDeletingAttempt,
    refreshHistory: loadHistory,
  };

  return (
    <AptitudeContext.Provider value={value}>
      {children}
    </AptitudeContext.Provider>
  );
};
