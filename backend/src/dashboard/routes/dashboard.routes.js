// src/dashboard/routes/dashboard.routes.js

import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

/*
  GET /api/dashboard/stats
*/
router.get("/stats", protect, getDashboardStats);

export default router;
