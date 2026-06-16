// src/modules/practices/aptitude/controllers/aptitude.controller.js

import asyncHandler from "../../../../utils/asyncHandler.js";
import rateLimitAI from "../../../../middleware/aiRateLimit.middleware.js";

import { generateAptitudePracticeService } from "../services/aptitude.service.js";

/* =====================================================
   APTITUDE CONTROLLER
   Keeps /api/aptitude contract unchanged
===================================================== */

/* =========================
   POST /api/aptitude/generate
========================= */
export const generateAptitudePractice = [
  rateLimitAI,
  asyncHandler(async (req, res) => {
    const { difficulty, count } = req.body;

    const result = await generateAptitudePracticeService({
      userId: req.user._id,
      difficulty,
      count,
    });

    res.status(201).json(result);
  }),
];
