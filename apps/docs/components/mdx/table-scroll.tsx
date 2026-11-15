'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface TableScrollState {
  scrollable: boolean;
  atStart: boolean;
  atEnd: boolean;
}

/**
 * Wraps a table in a horizontal scroll container and exposes edge state so
 * mobile gradient masks only appear while more content is hidden.
 */
export function TableScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<TableScrollState>({
    scrollable: false,
    atStart: true,
    atEnd: true,
  });

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const update = () => {
      const maxScroll = element.scrollWidth - element.clientWidth;
      const next = {
        scrollable: maxScroll > 1,
        atStart: element.scrollLeft <= 1,
        atEnd: maxScroll <= 1 || element.scrollLeft >= maxScroll - 1,
      };

      setState((previous) => {
        if (
          previous.scrollable === next.scrollable &&
          previous.atStart === next.atStart &&
          previous.atEnd === next.atEnd
        ) {
          return previous;
        }

        return next;
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    const table = element.firstElementChild;

    if (table) {
      observer.observe(table);
    }

    element.addEventListener('scroll', update, { passive: true });

    return () => {
      observer.disconnect();
      element.removeEventListener('scroll', update);
    };
  }, []);

  return (
    <div
      className="table-scroll-frame"
      data-scrollable={state.scrollable ? 'true' : 'false'}
      data-at-start={state.atStart ? 'true' : 'false'}
      data-at-end={state.atEnd ? 'true' : 'false'}
    >
      <div ref={ref} className="table-wrap">
        {children}
      </div>
    </div>
  );
}
