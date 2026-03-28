// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, logoutUser } from "../api/authApi.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bootLoading, setBootLoading] = useState(true);

  /* =====================================================
     RESTORE SESSION (cookie auth)
     - /api/auth/me may return 401 legitimately
     - 401 => unauthenticated (silent)
  ===================================================== */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch (err) {
        // ✅ 401 = not logged in (expected)
        if (err?.status === 401) setUser(null);
        else console.error("Auth restore failed:", err);
      } finally {
        setBootLoading(false);
      }
    };

    restoreSession();
  }, []);

  /* =====================================================
     MANUAL AUTH SETTER
     - Used after successful login/register flows
  ===================================================== */
  const setAuthenticatedUser = (userData) => {
    setUser(userData || null);
  };

  /* =====================================================
     LOGOUT
     - backend handles cookie/session cleanup
     - frontend only updates UI state
  ===================================================== */
  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // even if backend fails, still clear UI state
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading: bootLoading,
      setAuthenticatedUser,
      logout,
    }),
    [user, bootLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
export default AuthContext;