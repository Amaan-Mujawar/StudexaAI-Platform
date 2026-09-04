// src/context/QuizGuardContext.jsx

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* =====================================================
   QuizGuardContext
   ✅ Detects when user is on an active quiz attempt route
   ✅ Intercepts in-app navigations from the sidebar
   ✅ Exposes pendingNavTarget + confirmLeave for the modal
   ✅ Scoped to DashboardLayout — zero impact on other routes
===================================================== */

/**
 * Matches active quiz attempt routes.
 * Covers: ai-quiz, aptitude, logical-reasoning, verbal-reasoning.
 * Deliberately does NOT match /result or /review sub-routes.
 *
 * Examples that match (quiz is active):
 *   /dashboard/ai-quiz/abc123
 *   /dashboard/aptitude/xyz789
 *   /dashboard/logical-reasoning/def456
 *   /dashboard/verbal-reasoning/ghi012
 *
 * Examples that do NOT match (quiz not active):
 *   /dashboard/ai-quiz                         (home page)
 *   /dashboard/ai-quiz/abc123/result           (result page)
 *   /dashboard/ai-quiz/abc123/review           (review page)
 */
const QUIZ_ATTEMPT_REGEX =
  /^\/dashboard\/(ai-quiz|aptitude|logical-reasoning|verbal-reasoning|contest)\/([^/]+)$/;

const QuizGuardContext = createContext(null);

export const QuizGuardProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // The route the user is trying to go to while a quiz is active.
  // null means no pending navigation / modal is hidden.
  const [pendingNavTarget, setPendingNavTarget] = useState(null);

  // Ref to avoid stale closure issues in confirmLeave
  const pendingRef = useRef(null);
  pendingRef.current = pendingNavTarget;

  /** True when the current URL is an active quiz attempt */
  const isQuizActive = useMemo(
    () => QUIZ_ATTEMPT_REGEX.test(location.pathname),
    [location.pathname]
  );

  /**
   * Called by the sidebar's handleNav instead of navigate().
   * If a quiz is active, stores the target and opens the modal.
   * Otherwise, navigates immediately.
   */
  const guardedNavigate = useCallback(
    (to) => {
      if (QUIZ_ATTEMPT_REGEX.test(location.pathname)) {
        setPendingNavTarget(to);
      } else {
        navigate(to);
      }
    },
    [location.pathname, navigate]
  );

  /**
   * Resolves the pending navigation from the modal.
   * @param {boolean} shouldLeave - true = leave, false = stay
   */
  const confirmLeave = useCallback(
    (shouldLeave) => {
      if (shouldLeave && pendingRef.current) {
        navigate(pendingRef.current);
      }
      setPendingNavTarget(null);
    },
    [navigate]
  );

  const value = useMemo(
    () => ({
      isQuizActive,
      pendingNavTarget,
      guardedNavigate,
      confirmLeave,
    }),
    [isQuizActive, pendingNavTarget, guardedNavigate, confirmLeave]
  );

  return (
    <QuizGuardContext.Provider value={value}>
      {children}
    </QuizGuardContext.Provider>
  );
};

/**
 * Hook to consume the QuizGuardContext.
 * Throws if used outside a QuizGuardProvider.
 */
export const useQuizGuard = () => {
  const ctx = useContext(QuizGuardContext);
  if (!ctx) {
    throw new Error("useQuizGuard must be used inside <QuizGuardProvider>");
  }
  return ctx;
};

export default QuizGuardContext;
