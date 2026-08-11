// src/dashboard/controllers/dashboard.controller.js

import asyncHandler from "../../utils/asyncHandler.js";
import { getDashboardStatsService } from "../services/dashboard.service.js";

/* =====================================================
   DASHBOARD CONTROLLER
   GET /api/dashboard/stats
===================================================== */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const userRole = req.user?.role || "unknown";

  if (!userId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const stats = await getDashboardStatsService({ userId });
    res.status(200).json(stats);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    if (statusCode === 500) {
      console.error(`[Dashboard] Stats failure for ${userId}:`, error.message);
    }
    res.status(statusCode).json({
      message: error.message || "Failed to load dashboard statistics",
    });
  }
});

export default {
  getDashboardStats,
};
