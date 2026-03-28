// src/features/aiNotes/hooks/useAiNotes.js

import { useContext } from "react";
import AiNotesContext from "../context/AiNotesContext.jsx";

/* =====================================================
   useAiNotes Hook
   ✅ Clean access to AiNotesContext
   ✅ NO independent fetching
   ✅ Uses context only
===================================================== */

export const useAiNotes = () => {
    const ctx = useContext(AiNotesContext);
    if (!ctx) {
        throw new Error("useAiNotes must be used within <AiNotesProvider>");
    }
    return ctx;
};

export default useAiNotes;
