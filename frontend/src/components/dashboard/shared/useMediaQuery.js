// src/components/dashboard/shared/useMediaQuery.js

import { useEffect, useState } from "react";

/* =====================================================
   useMediaQuery (FINAL — industry standard)
   ✅ SSR safe
   ✅ Uses matchMedia properly
   ✅ Updates on changes
===================================================== */

/**
 * useMediaQuery("(min-width: 768px)")
 * returns boolean
 */
const useMediaQuery = (query) => {
  const get = () => {
    if (typeof window === "undefined") return false;
    if (typeof window.matchMedia !== "function") return false;
    return Boolean(window.matchMedia(query).matches);
  };

  const [matches, setMatches] = useState(get);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") return;

    const mql = window.matchMedia(query);

    const onChange = () => setMatches(Boolean(mql.matches));

    // sync on mount
    onChange();

    // modern + fallback
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;
