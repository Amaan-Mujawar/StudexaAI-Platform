// src/features/verbalReasoning/hooks/useVerbalReasoning.js

import { useContext } from "react";
import { VerbalReasoningContext } from "../context/VerbalReasoningContext.jsx";

export const useVerbalReasoning = () => {
    const ctx = useContext(VerbalReasoningContext);
    if (!ctx) {
        throw new Error("useVerbalReasoning must be used within <VerbalReasoningProvider>");
    }
    return ctx;
};

export default useVerbalReasoning;
