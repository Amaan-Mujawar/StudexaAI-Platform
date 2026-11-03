// src/features/logicalReasoning/pages/LogicalReasoningPage.jsx

import { Routes, Route } from "react-router-dom";
import { LogicalReasoningProvider } from "../context/LogicalReasoningContext.jsx";
import LogicalHome from "./LogicalHome.jsx";
import LogicalAttemptPage from "./LogicalAttemptPage.jsx";
import LogicalResultPage from "./LogicalResultPage.jsx";
import LogicalReviewPage from "./LogicalReviewPage.jsx";

/**
 * Logical Reasoning Feature Router
 */
const LogicalReasoningPage = () => {
  return (
    <LogicalReasoningProvider>
      <Routes>
        <Route index element={<LogicalHome />} />
        <Route path=":attemptId" element={<LogicalAttemptPage />} />
        <Route path=":attemptId/result" element={<LogicalResultPage />} />
        <Route path=":attemptId/review" element={<LogicalReviewPage />} />
      </Routes>
    </LogicalReasoningProvider>
  );
};

export default LogicalReasoningPage;
