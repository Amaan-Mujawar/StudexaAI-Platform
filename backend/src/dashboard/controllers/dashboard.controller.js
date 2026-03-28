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
    console.warn(`[Dashboard Controller] Blocked: Missing userId. Role: ${userRole}`);
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    console.log(`[Dashboard Controller] Fetching stats for ${userId} (${userRole})`);
    const stats = await getDashboardStatsService({ userId });
    res.status(200).json(stats);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error(`[Dashboard Controller] Critical Failure for ${userId}:`, {
      message: error.message,
      status: statusCode,
      stack: error.stack
    });

    res.status(statusCode).json({
      message: error.message || "Failed to load dashboard statistics",
      error: process.env.NODE_ENV === "production" ? undefined : error.stack
    });
  }
});

export default {
  getDashboardStats,
};
