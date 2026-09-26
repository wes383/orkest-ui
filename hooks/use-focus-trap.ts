"use client";

import * as React from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Visibility check that also handles `position: fixed` elements, which
 * `offsetParent` alone would wrongly report as invisible.
 */
function isVisible(node: HTMLElement): boolean {
  if (typeof node.checkVisibility === "function") {
    return node.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true });
  }
  // Fallback for older browsers.
  if (node.offsetParent !== null) return true;
  if (node.getClientRects().length === 0) return false;
  const style = window.getComputedStyle(node);
  return style.visibility !== "hidden" && style.display !== "none";
}

/**
 * useFocusTrap — when `active`, traps keyboard focus inside `ref`.
 * Tab/Shift+Tab cycle through focusable descendants only.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useFocusTrap(ref, isOpen);
 */
export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean = true
): void {
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  const getFocusable = React.useCallback(() => {
    const el = ref.current;
    if (!el) return [] as HTMLElement[];
    return Array.from(
      el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter(
      (node) =>
        !node.hasAttribute("disabled") &&
        node.getAttribute("aria-hidden") !== "true" &&
        isVisible(node)
    );
  }, [ref]);

  React.useEffect(() => {
    if (!active) return;
    if (typeof document === "undefined") return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const el = ref.current;
    if (!el) return;

    // Move focus into the container on activation.
    const focusables = getFocusable();
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      el.setAttribute("tabindex", "-1");
      el.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const nodes = getFocusable();
      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeEl === first || !el.contains(activeEl)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (activeEl === last || !el.contains(activeEl)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      el.removeAttribute("tabindex");
      // Restore focus to whatever was focused before activation.
      previouslyFocused.current?.focus?.();
    };
  }, [active, ref, getFocusable]);
}
