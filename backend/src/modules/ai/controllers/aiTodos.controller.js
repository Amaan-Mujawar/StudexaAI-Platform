// src/modules/ai/controllers/aiTodos.controller.js
import asyncHandler from "../../../utils/asyncHandler.js";
import rateLimitAI from "../../../middleware/aiRateLimit.middleware.js";

import {
  generateAiTodosService,
} from "../services/aiTodos.service.js";

/* =====================================================
   GENERATE AI TODOS
   POST /api/ai/todos
   - Protected
   - Rate-limited
===================================================== */
export const generateAiTodos = [
  rateLimitAI,
  asyncHandler(async (req, res) => {
    const { goal } = req.body;

    const result = await generateAiTodosService({ goal });

    res.status(200).json({
      todos: result.todos,
    });
  }),
];
