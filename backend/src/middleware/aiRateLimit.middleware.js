// src/middleware/aiRateLimit.middleware.js

import User from "../modules/auth/models/User.js";

/**
 * AI Rate Limit Middleware
 * ------------------------
 * Goals:
 * - Enforce daily AI usage quota per user
 * - Cookie/JWT auth already handled by `protect`
 * - MUST be safe even if accidentally applied twice
 *   (idempotent per request via req flag)
 * - Response contract: { message }
 */

const rateLimitAI = async (req, res, next) => {
  try {
    // ✅ Prevent double execution in same request lifecycle
    if (req._aiRateLimitApplied === true) {
      return next();
    }
    req._aiRateLimitApplied = true;

    const authUser = req.user;

    // Safety guard: protect middleware must set req.user
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // req.user is sanitized DTO from auth middleware, not a mongoose document.
    // Load the real document before reading/updating usage fields.
    const user = await User.findById(authUser._id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const now = new Date();
    const lastReset = user.aiLastReset ? new Date(user.aiLastReset) : null;

    // Reset daily usage once per calendar day
    if (!lastReset || now.toDateString() !== lastReset.toDateString()) {
      user.aiUsageCount = 0;
      user.aiLastReset = now;
      await user.save();
    }

    const limit = Number(process.env.AI_DAILY_LIMIT || 100);

    if (Number.isNaN(limit) || limit <= 0) {
      return res.status(500).json({ message: "AI limit not configured" });
    }

    if (Number(user.aiUsageCount || 0) >= limit) {
      return res.status(429).json({
        message: "You've consumed all your AI tokens for today. Please try again tomorrow!",
      });
    }

    user.aiUsageCount = Number(user.aiUsageCount || 0) + 1;
    await user.save();

    return next();
  } catch (error) {
    // no sensitive data exposure
    console.error("AI RateLimit Error:", error?.message || error);
    return res.status(500).json({ message: "AI rate limit check failed" });
  }
};

export default rateLimitAI;
