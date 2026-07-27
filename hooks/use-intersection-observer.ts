"use client";

import * as React from "react";

export type UseIntersectionObserverOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  /** Disconnect after the first intersection. @default false */
  once?: boolean;
  /** When true, the observer is active. @default true */
  enabled?: boolean;
};

/**
 * useIntersectionObserver — observe an element and return its latest entry.
 * SSR-safe (returns null on the server).
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const entry = useIntersectionObserver(ref, { threshold: 0.5 });
 * const isVisible = entry?.isIntersecting ?? false;
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
  options: UseIntersectionObserverOptions = {}
): IntersectionObserverEntry | null {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    once = false,
    enabled = true,
  } = options;

  const [entry, setEntry] = React.useState<IntersectionObserverEntry | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const next = entries[0] ?? null;
        setEntry(next);
        if (next?.isIntersecting && once) {
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, root, rootMargin, threshold, once, enabled]);

  return entry;
}
