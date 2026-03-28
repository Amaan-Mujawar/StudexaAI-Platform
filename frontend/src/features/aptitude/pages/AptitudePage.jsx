// src/features/aptitude/pages/AptitudePage.jsx

import { Routes, Route } from "react-router-dom";
import { AptitudeProvider } from "../context/AptitudeContext.jsx";
import AptitudeHome from "./AptitudeHome.jsx";
import AptitudeAttemptPage from "./AptitudeAttemptPage.jsx";
import AptitudeResultPage from "./AptitudeResultPage.jsx";
import AptitudeReviewPage from "./AptitudeReviewPage.jsx";

/**
 * Aptitude Feature Router
 */
const AptitudePage = () => {
  return (
    <AptitudeProvider>
      <Routes>
        <Route index element={<AptitudeHome />} />
        <Route path=":attemptId" element={<AptitudeAttemptPage />} />
        <Route path=":attemptId/result" element={<AptitudeResultPage />} />
        <Route path=":attemptId/review" element={<AptitudeReviewPage />} />
      </Routes>
    </AptitudeProvider>
  );
};

export default AptitudePage;
