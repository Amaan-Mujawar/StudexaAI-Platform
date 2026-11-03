// src/features/aptitude/hooks/useAptitude.js

import { useContext } from "react";
import { AptitudeContext } from "../context/AptitudeContext.jsx";

export const useAptitude = () => {
    const ctx = useContext(AptitudeContext);
    if (!ctx) {
        throw new Error("useAptitude must be used within <AptitudeProvider>");
    }
    return ctx;
};

export default useAptitude;
