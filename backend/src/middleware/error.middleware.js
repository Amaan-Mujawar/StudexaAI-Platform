// src/middleware/error.middleware.js

/**
 * Global Error Middleware
 * -----------------------
 * Goals:
 * - Contract-safe: ALWAYS return { message }
 * - Centralized handling for common backend failures
 * - No stack traces leaked in production
 * - Consistent status codes
 * - Never breaks frontend parsing
 */

const isProduction = process.env.NODE_ENV === "production";

const normalizeStatusCode = (code) => {
  const n = Number(code);
  if (!Number.isFinite(n)) return 500;
  if (n < 100 || n > 599) return 500;
  return n;
};

const errorMiddleware = (err, req, res, next) => {
  // If headers already sent, delegate to Express default handler
  if (res.headersSent) return next(err);

  let statusCode =
    err?.statusCode ?? err?.status ?? err?.code ?? err?.statusCode;

  statusCode = normalizeStatusCode(statusCode || 500);

  let message =
    (typeof err?.message === "string" && err.message.trim()) ||
    "Internal Server Error";

  // Logging (quiet in prod, useful in dev, loud for real 500s)
  if (statusCode === 500) {
    console.error("SERVER 500 ERROR:", {
      message: err?.message,
      stack: err?.stack,
      url: req.originalUrl,
      method: req.method,
    });
  } else if (!isProduction) {
    console.log(`[${req.method}] ${req.originalUrl} - ${statusCode}: ${message}`);
  }

  /**
   * -----------------------------
   * MONGOOSE / DATABASE ERRORS
   * -----------------------------
   */

  // Invalid ObjectId
  if (err?.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Mongoose validation errors
  if (err?.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    message = messages.length ? messages[0] : "Validation failed";

    if (!isProduction) {
      console.log(`[Validation Error] ${req.method} ${req.originalUrl}:`, messages);
    }
  }

  // Duplicate key error (E11000)
  if (err?.code === 11000) {
    statusCode = 409;
    const keyValue = err.keyValue || {};
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];

    // Special case: bad throttle key or misconfigured unique index
    // Also handle legacy 'key' field from older AuthThrottle versions
    if ((field === "key" || field === "email") && (value == null || value === "")) {
      statusCode = 400;
      message = "Invalid request identifier for rate limiting";
    } else {
      message = field ? `${field} already exists` : "Duplicate key error";
    }
  }

  /**
   * -----------------------------
   * JWT / AUTH ERRORS
   * -----------------------------
   */

  if (err?.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Not authorized";
  }

  if (err?.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired";
  }

  /**
   * -----------------------------
   * FINAL RESPONSE (CONTRACT)
   * -----------------------------
   */

  const response = { message };

  // Stack only in development
  if (!isProduction && err?.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

export default errorMiddleware;