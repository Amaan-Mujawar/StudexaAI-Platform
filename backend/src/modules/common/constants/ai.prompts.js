// src/modules/common/constants/ai.prompts.js

/* =====================================================
   CENTRAL AI PROMPTS (SINGLE SOURCE OF TRUTH)
   - Used by AI Todos, AI Notes, Todo→Note, Quiz, Practices
   - Keeping prompts in one place reduces controller churn
   - This file MUST stay pure constants only
===================================================== */

export const AI_MODELS = {
  DEFAULT: "llama-3.3-70b-versatile",
};

/* =====================================================
   AI TODOS (3 tasks, plain text)
===================================================== */
export const AI_TODO_SYSTEM_PROMPT = `
You generate ONLY TODO suggestions.
Return EXACTLY 3 short tasks.
No numbering.
No explanations.
Plain text lines only.
`.trim();

/* =====================================================
   AI NOTES (subject/topic based)
===================================================== */
export const buildAiNotePrompt = ({ topic, level }) => {
  const cleanTopic = String(topic || "").trim();

  if (level === "detailed") {
    return `Explain in detail with examples:\n${cleanTopic}`;
  }

  // default short
  return `Explain briefly in exam-oriented bullet points:\n${cleanTopic}`;
};

export const buildAiNoteFromTodoPrompt = ({ todoTitle }) => {
  const cleanTitle = String(todoTitle || "").trim();
  return `Explain clearly with examples:\n${cleanTitle}`;
};

export const buildAiNoteRegeneratePrompt = ({ subject, mode }) => {
  const cleanSubject = String(subject || "").trim();

  if (mode === "detailed") {
    return `Explain in detail with fresh examples:\n${cleanSubject}`;
  }

  return `Explain briefly in exam-oriented bullet points:\n${cleanSubject}`;
};

/* =====================================================
   QUIZ GENERATION PROMPT
===================================================== */
export const buildQuizPrompt = ({ topic, count, difficulty }) => {
  const cleanTopic = String(topic || "").trim();

  return `
Generate ${count} UNIQUE ${difficulty} difficulty multiple choice questions.

STRICT RULES:
- Questions must be DIFFERENT every time
- Do NOT repeat common or generic questions
- Return ONLY valid JSON (array)
- No markdown, no extra text

Each object format:
{
  "question": "string",
  "options": ["A","B","C","D"],
  "correctIndex": 0-3,
  "explanation": "string"
}

Topic: ${cleanTopic}
`.trim();
};

/* =====================================================
   PRACTICE GENERATION PROMPTS
===================================================== */
export const buildLogicalReasoningPrompt = ({ count, difficulty }) => {
  return `
Generate ${count} UNIQUE ${difficulty} difficulty logical reasoning multiple choice questions.

These questions must reflect REAL interview and screening rounds.

STRICT RULES:
- Questions must be RANDOM and UNIQUE every time
- No academic or textbook framing
- Include logical traps where appropriate
- Return ONLY valid JSON (array)
- No markdown, no extra text

Each object format:
{
  "question": "string",
  "options": ["A","B","C","D"],
  "correctIndex": 0-3,
  "explanation": "string"
}
`.trim();
};

export const buildAptitudePrompt = ({ count, difficulty }) => {
  return `
Generate ${count} UNIQUE ${difficulty} difficulty quantitative aptitude multiple choice questions.

Focus areas:
- Arithmetic
- Ratios & Percentages
- Profit & Loss
- Time & Work
- Speed & Distance
- Basic Algebra
- Data Interpretation (light, MCQ-based)

These questions must reflect REAL placement tests and screening rounds.

STRICT RULES:
- Questions must be RANDOM and UNIQUE every time
- Avoid academic wording
- Prefer calculation-based and logic-driven questions
- Return ONLY valid JSON (array)
- No markdown, no extra text

Each object format:
{
  "question": "string",
  "options": ["A","B","C","D"],
  "correctIndex": 0-3,
  "explanation": "string"
}
`.trim();
};

export const buildVerbalReasoningPrompt = ({ count, difficulty }) => {
  return `
Generate ${count} UNIQUE ${difficulty} difficulty verbal reasoning multiple choice questions.

Question types must include:
- Reading comprehension
- Inference-based reasoning
- Sentence completion
- Contextual and logical interpretation

These questions must reflect REAL interview and screening rounds.

STRICT RULES:
- Questions must be RANDOM and UNIQUE every time
- Avoid academic or textbook tone
- Focus on practical reasoning and understanding
- Return ONLY valid JSON (array)
- No markdown
- No explanations outside JSON
- No extra text

Each object format:
{
  "question": "string",
  "options": ["A","B","C","D"],
  "correctIndex": 0-3,
  "explanation": "string"
}
`.trim();
}; 
