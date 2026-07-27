"use client";

import * as React from "react";

export interface UseVirtualListOptions {
  /** Total number of items in the underlying list. */
  itemCount: number;
  /** Fixed height of each item, in px. */
  itemHeight: number;
  /** Height of the scrollable viewport, in px. */
  viewportHeight: number;
  /** Extra items rendered above/below the visible window. @default 3 */
  overscan?: number;
  /** Current scroll offset from the top, in px. @default 0 */
  scrollTop?: number;
  /**
   * Ref to the scroll container. When provided, `scrollToIndex` calls the
   * container's `scrollTo({ top })` directly; callers don't need to handle
   * the return value themselves.
   */
  containerRef?: React.RefObject<HTMLElement | null>;
}

export interface VirtualItem {
  /** The index in the underlying data array. */
  index: number;
  /** Top offset in px (use this for absolute positioning). */
  offsetTop: number;
}

export interface UseVirtualListReturn {
  virtualItems: VirtualItem[];
  totalHeight: number;
  /** Scroll to a given index. If `containerRef` is provided, scrolls the container directly; returns the target top value for the caller's optional use. */
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => { top: number };
}

/**
 * useVirtualList — minimal windowing for large fixed-height lists.
 *
 * Pure compute hook (no DOM listeners); pair it with your own scroll handler
 * that feeds `scrollTop` back in.
 *
 * @example
 * const containerRef = React.useRef<HTMLDivElement>(null);
 * const { virtualItems, totalHeight, scrollToIndex } = useVirtualList({
 *   itemCount: 1000,
 *   itemHeight: 40,
 *   viewportHeight: 600,
 *   scrollTop,
 *   containerRef,
 * });
 *
 * <div ref={containerRef} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
 *   ...
 * </div>
 *
 * // Scroll to the 50th item:
 * scrollToIndex(50);
 */
export function useVirtualList(options: UseVirtualListOptions): UseVirtualListReturn {
  const {
    itemCount,
    itemHeight,
    viewportHeight,
    overscan = 3,
    scrollTop = 0,
    containerRef,
  } = options;

  const totalHeight = React.useMemo(() => itemCount * itemHeight, [itemCount, itemHeight]);

  const virtualItems = React.useMemo(() => {
    if (itemCount <= 0 || itemHeight <= 0) return [] as VirtualItem[];

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(viewportHeight / itemHeight) + overscan * 2;
    const endIndex = Math.min(itemCount, startIndex + visibleCount);

    const items: VirtualItem[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push({ index: i, offsetTop: i * itemHeight });
    }
    return items;
  }, [itemCount, itemHeight, viewportHeight, overscan, scrollTop]);

  const scrollToIndex = React.useCallback(
    (index: number, behavior: ScrollBehavior = "auto") => {
      const clamped = Math.max(0, Math.min(itemCount - 1, index));
      const top = clamped * itemHeight;
      const el = containerRef?.current;
      if (el) {
        el.scrollTo({ top, behavior });
      }
      return { top };
    },
    [itemCount, itemHeight, containerRef]
  );

  return { virtualItems, totalHeight, scrollToIndex };
}
