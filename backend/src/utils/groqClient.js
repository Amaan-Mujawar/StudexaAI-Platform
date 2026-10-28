import Groq from "groq-sdk";
import { AI_MODELS } from "../modules/common/constants/ai.prompts.js";

/* ─── Singleton real SDK client ─────────────────────────────────────────── */
let _groq;

const _getRealClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY missing");
  }
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
};

/* ─── Rate-limit / quota detection ─────────────────────────────────────── */
const _isRateLimit = (err) =>
  err?.status === 429 ||
  err?.statusCode === 429 ||
  err?.error?.type === "tokens" ||
  err?.error?.code === "rate_limit_exceeded" ||
  /rate.?limit|quota|tokens.*exceeded/i.test(err?.message ?? "");

/* ─── Wrapped client with transparent fallback ───────────────────────────
 *
 *  Usage in services is unchanged:
 *    const groq = getGroqClient();
 *    groq.chat.completions.create({ model: AI_MODELS.DEFAULT, ... });
 *
 *  When the primary model (AI_MODELS.DEFAULT) hits a 429, the wrapper
 *  automatically retries the exact same request using AI_MODELS.FALLBACK.
 *  If the fallback also fails, the error is re-thrown as normal.
 * ─────────────────────────────────────────────────────────────────────── */
const getGroqClient = () => {
  const real = _getRealClient();

  return {
    chat: {
      completions: {
        create: async (params) => {
          try {
            return await real.chat.completions.create(params);
          } catch (err) {
            if (_isRateLimit(err) && params.model !== AI_MODELS.FALLBACK) {
              console.warn(
                `[Groq] Rate limit on "${params.model}" — switching to fallback "${AI_MODELS.FALLBACK}"`
              );
              return await real.chat.completions.create({
                ...params,
                model: AI_MODELS.FALLBACK,
              });
            }
            throw err;
          }
        },
      },
    },
  };
};

export default getGroqClient;
