// src/modules/practices/logicalReasoning/controllers/logicalReasoning.controller.js

import asyncHandler from "../../../../utils/asyncHandler.js";
import rateLimitAI from "../../../../middleware/aiRateLimit.middleware.js";

import { generateLogicalReasoningPracticeService } from "../services/logicalReasoning.service.js";

/* =====================================================
   LOGICAL REASONING CONTROLLER
   Keeps /api/logical-reasoning contract unchanged
===================================================== */

/* =========================
   POST /api/logical-reasoning/generate
========================= */
export const generateLogicalReasoningPractice = [
  rateLimitAI,
  asyncHandler(async (req, res) => {
    const { difficulty, count } = req.body;

    const result = await generateLogicalReasoningPracticeService({
      userId: req.user._id,
      difficulty,
      count,
    });

    res.status(201).json(result);
  }),
];

export default {
  generateLogicalReasoningPractice,
};
