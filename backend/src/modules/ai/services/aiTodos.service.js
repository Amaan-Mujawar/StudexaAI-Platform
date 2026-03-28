// src/modules/ai/services/aiTodos.service.js
import getGroqClient from "../../../utils/groqClient.js";

import {
  AI_MODELS,
  AI_TODO_SYSTEM_PROMPT,
} from "../../common/constants/ai.prompts.js";

/* =====================================================
   AI TODOS SERVICE
   - Pure AI generation (NO DB)
===================================================== */

/**
 * Generate exactly 3 todo suggestions from a goal
 * @param {{ goal: string }} params
 * @returns {Promise<{ todos: string[] }>}
 */
export const generateAiTodosService = async ({ goal }) => {
  const cleanGoal = typeof goal === "string" ? goal.trim() : "";

  if (!cleanGoal) {
    const err = new Error("Goal is required");
    err.statusCode = 400;
    throw err;
  }

  const groq = getGroqClient();

  try {
    const completion = await groq.chat.completions.create({
      model: AI_MODELS.DEFAULT,
      temperature: 0.3,
      messages: [
        { role: "system", content: AI_TODO_SYSTEM_PROMPT },
        { role: "user", content: cleanGoal },
      ],
    });

    const raw = completion?.choices?.[0]?.message?.content || "";

    const todos = raw
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 3);

    // Always enforce EXACTLY 3 (frontend expectation)
    while (todos.length < 3) {
      todos.push("Review today's study plan");
    }

    return { todos };
  } catch (e) {
    const err = new Error("AI request failed");
    err.statusCode = 500;
    throw err;
  }
};

export default {
  generateAiTodosService,
};
