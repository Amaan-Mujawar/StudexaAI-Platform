// src/features/aiQuiz/pages/AiQuizPage.jsx

import { Routes, Route } from "react-router-dom";
import { AiQuizProvider } from "../context/AiQuizContext.jsx";
import AiQuizHome from "./AiQuizHome.jsx";
import AiQuizAttemptPage from "./AiQuizAttemptPage.jsx";
import AiQuizResultPage from "./AiQuizResultPage.jsx";
import AiQuizReviewPage from "./AiQuizReviewPage.jsx";

/**
 * AI Quiz Feature Router
 * Keeps the provider alive across all sub-views
 */
const AiQuizPage = () => {
  return (
    <AiQuizProvider>
      <Routes>
        <Route index element={<AiQuizHome />} />
        <Route path=":attemptId" element={<AiQuizAttemptPage />} />
        <Route path=":attemptId/result" element={<AiQuizResultPage />} />
        <Route path=":attemptId/review" element={<AiQuizReviewPage />} />
      </Routes>
    </AiQuizProvider>
  );
};

export default AiQuizPage;
