// src/features/logicalReasoning/hooks/useLogicalReasoning.js

import { useContext } from "react";
import { LogicalReasoningContext } from "../context/LogicalReasoningContext.jsx";

export const useLogicalReasoning = () => {
    const ctx = useContext(LogicalReasoningContext);
    if (!ctx) {
        throw new Error("useLogicalReasoning must be used within <LogicalReasoningProvider>");
    }
    return ctx;
};

export default useLogicalReasoning;
