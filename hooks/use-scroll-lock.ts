"use client";

import * as React from "react";

interface ScrollLockState {
  lockedCount: number;
  paddingRight: string;
}

// Module-level counter so multiple hooks share the same bookkeeping.
let lockState: ScrollLockState = { lockedCount: 0, paddingRight: "" };

function applyLock() {
  if (typeof document === "undefined") return;
  const { body } = document;
  const hasScrollbar = window.innerWidth - document.documentElement.clientWidth > 0;
  if (hasScrollbar && !lockState.paddingRight) {
    const computed = window.getComputedStyle(body).paddingRight;
    const parsed = parseInt(computed || "0", 10) || 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    lockState.paddingRight = `${parsed + scrollbarWidth}px`;
    body.style.paddingRight = lockState.paddingRight;
  }
  body.style.overflow = "hidden";
}

function releaseLock() {
  if (typeof document === "undefined") return;
  const { body } = document;
  if (lockState.paddingRight) {
    body.style.paddingRight = "";
    lockState.paddingRight = "";
  } else {
    body.style.paddingRight = "";
  }
  body.style.overflow = "";
}

/**
 * useScrollLock — locks body scroll when `locked` is true.
 * Compensates for the scrollbar width to prevent layout shift.
 * Safe to use from multiple components simultaneously.
 *
 * @example
 * const [open, setOpen] = useState(false);
 * useScrollLock(open);
 */
export function useScrollLock(locked = true): void {
  React.useEffect(() => {
    if (!locked) return;
    lockState.lockedCount += 1;
    if (lockState.lockedCount === 1) applyLock();
    return () => {
      lockState.lockedCount = Math.max(0, lockState.lockedCount - 1);
      if (lockState.lockedCount === 0) releaseLock();
    };
  }, [locked]);
}
