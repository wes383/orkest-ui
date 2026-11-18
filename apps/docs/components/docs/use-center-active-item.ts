'use client';

import { useEffect, useRef, type RefObject } from 'react';

/** Keeps an entry clipped by the fade mask out of "already visible" territory. */
const EDGE_INSET = 8;

/**
 * Brings the active navigation item into view. A direct page load starts the
 * sidebar at the top, so the current entry has to be centred explicitly; a
 * client-side route change reuses the same scroll container, which would leave
 * the new entry outside the visible area when the reader jumps between distant
 * groups. Route changes only scroll when needed, so stepping through neighbours
 * keeps the reader's position.
 */
export function useCenterActiveItem<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  activePath?: string,
) {
  const hasRun = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const active = container?.querySelector<HTMLElement>('[aria-current="page"]');

    if (!container || !active) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const isFirstRun = !hasRun.current;

    hasRun.current = true;

    const alreadyVisible =
      activeRect.top >= containerRect.top + EDGE_INSET &&
      activeRect.bottom <= containerRect.bottom - EDGE_INSET;

    if (!isFirstRun && alreadyVisible) {
      return;
    }

    const maxScroll = Math.max(container.scrollHeight - container.clientHeight, 0);
    const centered =
      container.scrollTop +
      (activeRect.top - containerRect.top) +
      activeRect.height / 2 -
      container.clientHeight / 2;

    container.scrollTop = Math.min(Math.max(centered, 0), maxScroll);
  }, [containerRef, activePath]);
}
