'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollOverflowState {
  overflowing: boolean;
  atTop: boolean;
  atBottom: boolean;
}

/**
 * Tracks overflow and edge position so fade masks can appear only while there
 * is hidden content above or below the visible area.
 */
export function useScrollOverflow<T extends HTMLElement>(dependency?: unknown) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<ScrollOverflowState>({
    overflowing: false,
    atTop: true,
    atBottom: true,
  });

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const update = () => {
      const maxScroll = element.scrollHeight - element.clientHeight;
      const next = {
        overflowing: maxScroll > 1,
        atTop: element.scrollTop <= 1,
        atBottom: maxScroll <= 1 || element.scrollTop >= maxScroll - 1,
      };

      setState((previous) => {
        if (
          previous.overflowing === next.overflowing &&
          previous.atTop === next.atTop &&
          previous.atBottom === next.atBottom
        ) {
          return previous;
        }

        return next;
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener('scroll', update, { passive: true });

    return () => {
      observer.disconnect();
      element.removeEventListener('scroll', update);
    };
  }, [dependency]);

  return { ref, ...state };
}
