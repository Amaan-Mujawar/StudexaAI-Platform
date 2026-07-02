// src/modules/practices/verbalReasoning/controllers/verbalReasoning.controller.js

import asyncHandler from "../../../../utils/asyncHandler.js";
import rateLimitAI from "../../../../middleware/aiRateLimit.middleware.js";

import { generateVerbalReasoningPracticeService } from "../services/verbalReasoning.service.js";

/* =====================================================
   VERBAL REASONING PRACTICE CONTROLLER
   Keeps /api/verbal-reasoning contract unchanged
===================================================== */

/*
  Generate Verbal Reasoning Practice
  POST /api/verbal-reasoning/generate
*/
export const generateVerbalReasoningPractice = [
  rateLimitAI,
  asyncHandler(async (req, res) => {
    const { difficulty, count } = req.body;

    const result = await generateVerbalReasoningPracticeService({
      userId: req.user._id,
      difficulty,
      count,
    });

    res.status(201).json(result);
  }),
];

export default {
  generateVerbalReasoningPractice,
};
