'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether an element has enough content to scroll so decorative fade
 * masks only appear when there is hidden content.
 */
export function useScrollOverflow<T extends HTMLElement>(dependency?: unknown) {
  const ref = useRef<T>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const update = () => {
      setOverflowing(element.scrollHeight > element.clientHeight + 1);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, [dependency]);

  return { ref, overflowing };
}
