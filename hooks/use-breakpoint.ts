"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/** Tailwind v3 default breakpoint values (in px). */
export const BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const ORDER: Breakpoint[] = ["xs", "sm", "md", "lg", "xl", "2xl"];

function getCurrentBreakpoint(width: number): Breakpoint {
  let current: Breakpoint = "xs";
  for (const bp of ORDER) {
    if (width >= BREAKPOINTS[bp]) current = bp;
  }
  return current;
}

/**
 * useBreakpoint — returns the current Tailwind breakpoint name based on viewport width.
 * SSR-safe (returns `xs` on the server, updates on mount).
 */
export function useBreakpoint(): Breakpoint {
  const [width, setWidth] = React.useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  React.useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (typeof window === "undefined") return "xs";
  return getCurrentBreakpoint(width);
}

/**
 * useIsMobile — returns `true` when the viewport is narrower than 768px (Tailwind `md`).
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

export { getCurrentBreakpoint };
