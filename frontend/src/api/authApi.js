
import api from "../services/api.js";

/* =====================================================
   StudexaAI — Auth API (FINAL)
   - Uses centralized axios client
   - Cookie session safe
   - Consistent error handling
   - Mirrors backend exactly
===================================================== */

/**
 * Restore authenticated user session
 * GET /api/auth/me
 * @returns {Promise<Object|null>}
 */
export const getMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    const status = err?.response?.status ?? err?.status;

    // Silent unauthenticated state
    if (status === 401) return null;

    // Network / connection errors → treat as unauthenticated so UI doesn't hang
    if (
      status == null &&
      (err?.message?.includes("Network") || err?.code === "ERR_NETWORK")
    ) {
      return null;
    }

    throw err;
  }
};

/**
 * Login user
 * POST /api/auth/login
 * @param {{ email: string, password: string }}
 * @returns {Promise<Object>}
 */
export const loginUser = async ({ email, password }) => {
  const payload = {
    email: String(email || "").trim().toLowerCase(),
    password: String(password || ""),
  };

  const res = await api.post("/auth/login", payload);
  return res.data;
};

/**
 * Logout user (clears cookie/session)
 * POST /api/auth/logout
 * @returns {Promise<Object>}
 */
export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export default {
  getMe,
  loginUser,
  logoutUser,
};