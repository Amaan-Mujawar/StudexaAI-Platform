// src/modules/auth/utils/authCookies.js

/* =====================================================
   AUTH COOKIE HELPERS
   - single source of truth for cookie options
   - prevents logout cookie-mismatch bugs
   - industry standard cookie hardening
===================================================== */

const COOKIE_NAME = "jwt";

const isProduction = process.env.NODE_ENV === "production";

/**
 * IMPORTANT:
 * - If frontend + backend are on different domains in production,
 *   you MUST use: SAME_SITE="none" + SECURE=true
 *
 * Recommended env setup for prod cross-site:
 * SAME_SITE=none
 * COOKIE_SECURE=true
 *
 * For localhost dev:
 * SAME_SITE=lax
 * COOKIE_SECURE=false
 */
const getSameSite = () => {
  const v = String(process.env.COOKIE_SAMESITE || "").toLowerCase().trim();
  if (v === "none") return "none";
  if (v === "strict") return "strict";
  return "lax";
};

const getSecure = () => {
  const env = String(process.env.COOKIE_SECURE || "").toLowerCase().trim();
  if (env === "true") return true;
  if (env === "false") return false;

  // fallback: secure only in production
  return isProduction;
};

export const getAuthCookieOptions = () => {
  const sameSite = getSameSite();

  // if SameSite=None then Secure MUST be true (browser requirement)
  const secure = sameSite === "none" ? true : getSecure();

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
  };
};

export const setAuthCookie = (res, token) => {
  const base = getAuthCookieOptions();

  res.cookie(COOKIE_NAME, token, {
    ...base,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookie = (res) => {
  const base = getAuthCookieOptions();

  // must match cookie options used in setAuthCookie()
  res.cookie(COOKIE_NAME, "", {
    ...base,
    expires: new Date(0),
  });
};

export default {
  setAuthCookie,
  clearAuthCookie,
  getAuthCookieOptions,
};
