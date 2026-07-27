"use client";

import * as React from "react";

export interface UseClickOutsideOptions {
  /** Whether the handler is active. @default true */
  enabled?: boolean;
  /** Additional refs whose contents should also be ignored. */
  ignoreRefs?: React.RefObject<HTMLElement | null>[];
  /** Event names to listen for. @default ["mousedown", "touchstart"] */
  events?: ("mousedown" | "touchstart" | "pointerdown")[];
}

/**
 * useClickOutside — invoke `handler` when a click happens outside `ref`.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => close(), { enabled: isOpen });
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: (event: Event) => void,
  options: UseClickOutsideOptions = {}
) {
  const {
    enabled = true,
    ignoreRefs = [],
    events = ["mousedown", "touchstart"],
  } = options;

  // Keep latest handler without re-binding listeners.
  const handlerRef = React.useRef(handler);
  handlerRef.current = handler;

  React.useEffect(() => {
    if (!enabled) return;

    const listener = (event: Event) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      for (const ignoreRef of ignoreRefs) {
        if (ignoreRef.current?.contains(event.target as Node)) return;
      }
      handlerRef.current(event);
    };

    events.forEach((evt) => {
      document.addEventListener(evt, listener, { passive: true });
    });
    return () => {
      events.forEach((evt) => {
        document.removeEventListener(evt, listener);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, events, ignoreRefs, ref]);
}
