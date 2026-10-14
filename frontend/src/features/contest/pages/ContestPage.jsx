// src/features/contest/pages/ContestPage.jsx
import { useEffect, useRef } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ContestProvider } from "../context/ContestContext.jsx";
import ContestHomePage from "./ContestHomePage.jsx";
import ContestAttemptPage from "./ContestAttemptPage.jsx";
import ContestResultPage from "./ContestResultPage.jsx";
import ContestLeaderboardPage from "./ContestLeaderboardPage.jsx";

/**
 * ContestAttemptWrapper:
 *  - Intercepts the navigation from ContestHomePage which stores the attempt
 *    in sessionStorage before navigating to /:attemptId
 */
const ContestAttemptWrapper = () => {
    return <ContestAttemptPage />;
};

/**
 * The ContestPage is the feature-level router entry.
 * ContestProvider is mounted here so Socket.io persists across all sub-pages.
 */
const ContestPage = () => {
    return (
        <ContestProvider>
            <Routes>
                <Route index element={<ContestHomePage />} />
                <Route path="leaderboard" element={<ContestLeaderboardPage />} />
                <Route path=":attemptId" element={<ContestAttemptWrapper />} />
                <Route path=":attemptId/result" element={<ContestResultPage />} />
            </Routes>
        </ContestProvider>
    );
};

export default ContestPage;
