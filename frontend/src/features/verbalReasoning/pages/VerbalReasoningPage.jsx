// src/features/verbalReasoning/pages/VerbalReasoningPage.jsx

import { Routes, Route } from "react-router-dom";
import { VerbalReasoningProvider } from "../context/VerbalReasoningContext.jsx";
import VerbalHome from "./VerbalHome.jsx";
import VerbalAttemptPage from "./VerbalAttemptPage.jsx";
import VerbalResultPage from "./VerbalResultPage.jsx";
import VerbalReviewPage from "./VerbalReviewPage.jsx";

/**
 * Verbal Reasoning Feature Router
 */
const VerbalReasoningPage = () => {
  return (
    <VerbalReasoningProvider>
      <Routes>
        <Route index element={<VerbalHome />} />
        <Route path=":attemptId" element={<VerbalAttemptPage />} />
        <Route path=":attemptId/result" element={<VerbalResultPage />} />
        <Route path=":attemptId/review" element={<VerbalReviewPage />} />
      </Routes>
    </VerbalReasoningProvider>
  );
};

export default VerbalReasoningPage;
