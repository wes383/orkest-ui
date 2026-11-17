'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Centres the active navigation item inside its scroll container. Opening a page
 * directly would otherwise leave the sidebar scrolled to the top, with the
 * current entry far outside the visible area.
 */
export function useCenterActiveItem<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  activeKey: string,
) {
  useEffect(() => {
    const container = containerRef.current;
    const active = container?.querySelector<HTMLElement>('[aria-current="page"]');

    if (!container || !active) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const maxScroll = Math.max(container.scrollHeight - container.clientHeight, 0);
    const centered =
      container.scrollTop +
      (activeRect.top - containerRect.top) +
      activeRect.height / 2 -
      container.clientHeight / 2;

    container.scrollTop = Math.min(Math.max(centered, 0), maxScroll);
  }, [containerRef, activeKey]);
}
