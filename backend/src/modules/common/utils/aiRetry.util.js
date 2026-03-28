// src/modules/common/utils/aiRetry.util.js

/**
 * AI Retry Utility
 * ----------------
 * Used by Quiz + Practices generation services to make AI generation robust.
 *
 * Handles:
 * - invalid JSON returned by AI
 * - schema mismatch
 * - duplicates detected (via caller-provided validator)
 *
 * IMPORTANT:
 * - This utility is framework-agnostic.
 * - It must not import Groq client directly.
 */

const throwError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

/**
 * Safely parses JSON string
 * @param {string} raw
 * @returns {{ok:true,value:any}|{ok:false,error:string}}
 */
export const safeJsonParse = (raw) => {
  try {
    const value = JSON.parse(raw);
    return { ok: true, value };
  } catch {
    return { ok: false, error: "INVALID_JSON" };
  }
};

/**
 * Generic AI retry wrapper
 *
 * @param {object} params
 * @param {number} [params.maxRetries]
 * @param {() => Promise<string>} params.callAI - must return raw string content from AI
 * @param {(parsed:any) => {ok:boolean, error?:string}} params.validate
 * @param {(parsed:any) => Promise<void>} [params.afterSuccess] - e.g. persist fingerprints
 *
 * @returns {Promise<any>} parsed AI result
 */
export const aiRetryGuard = async ({
  maxRetries = 3,
  callAI,
  validate,
  afterSuccess,
}) => {
  if (typeof callAI !== "function") {
    throwError("AI request failed", 500);
  }

  if (typeof validate !== "function") {
    throwError("AI request failed", 500);
  }

  const safeRetries =
    typeof maxRetries === "number" && maxRetries >= 0 ? maxRetries : 3;

  let lastErr = null;

  for (let attempt = 0; attempt <= safeRetries; attempt += 1) {
    try {
      const raw = await callAI();

      if (!raw || typeof raw !== "string") {
        lastErr = "EMPTY_RESPONSE";
        continue;
      }

      const parsed = safeJsonParse(raw);
      if (!parsed.ok) {
        lastErr = parsed.error;
        continue;
      }

      const validation = validate(parsed.value);
      if (!validation?.ok) {
        lastErr = validation?.error || "SCHEMA_INVALID";
        continue;
      }

      if (typeof afterSuccess === "function") {
        await afterSuccess(parsed.value);
      }

      return parsed.value;
    } catch (err) {
      lastErr = err?.message || "AI_FAILED";
    }
  }

  // Toast friendly error after exhausting retries
  throwError(
    lastErr === "INVALID_JSON"
      ? "AI returned invalid format. Please try again."
      : lastErr === "SCHEMA_INVALID"
      ? "AI generation failed validation. Please try again."
      : "AI request failed. Please try again later.",
    500
  );
};

export default {
  safeJsonParse,
  aiRetryGuard,
};
