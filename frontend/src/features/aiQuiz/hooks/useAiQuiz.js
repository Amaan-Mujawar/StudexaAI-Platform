// src/features/aiQuiz/hooks/useAiQuiz.js

import { useContext } from "react";
import { AiQuizContext } from "../context/AiQuizContext.jsx";

export const useAiQuiz = () => {
    const ctx = useContext(AiQuizContext);
    if (!ctx) {
        throw new Error("useAiQuiz must be used within <AiQuizProvider>");
    }
    return ctx;
};

export default useAiQuiz;
