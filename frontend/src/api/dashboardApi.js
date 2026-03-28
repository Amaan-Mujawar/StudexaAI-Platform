// src/api/dashboardApi.js

import api from "../services/api.js";

/* =====================================================
   Dashboard API (FINAL)
   - Uses centralized axios client
   - Cookie auth safe
   - Consistent errors
===================================================== */

/**
 * Fetch dashboard statistics
 * @returns {Promise<Object>}
 */
export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res.data;
};

export default {
  getDashboardStats,
};
