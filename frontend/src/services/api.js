// src/services/api.js

import axios from "axios";

/* =====================================================
   StudexaAI — Core API Client (FINAL)
   - Cookie based auth (httpOnly JWT)
   - Centralized error handling
   - No endpoint mutation
   - Works across all features
===================================================== */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // REQUIRED for cookie auth
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use(
  (config) => {
    // Future: attach headers if needed (CSRF, tracing, etc)
    const token = localStorage.getItem("studexa_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   RESPONSE INTERCEPTOR
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status || 500;
    let message =
      error?.response?.data?.message ||
      error?.message ||
      "Unexpected server error";

    // ✅ Centralized Rate Limit Wording Policy
    if (status === 429) {
      message = "You've consumed all your AI tokens for today. Please try again tomorrow!";
    }

    const normalizedError = {
      status,
      message,
      data: error?.response?.data || null,
    };

    return Promise.reject(normalizedError);
  }
);

export default api;
