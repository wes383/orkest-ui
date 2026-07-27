"use client";

import * as React from "react";

/**
 * useMediaQuery — SSR-safe boolean for whether `query` currently matches.
 * Returns `false` during SSR / first paint, then updates on mount.
 *
 * @example
 * const isWide = useMediaQuery("(min-width: 1024px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    // Safari <14 fallback
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    } else {
      mql.addListener(onChange);
      return () => mql.removeListener(onChange);
    }
  }, [query]);

  return matches;
}
