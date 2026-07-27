"use client";

import * as React from "react";

export interface UseClipboardOptions {
  /** Reset `copied` back to false after this many ms. @default 2000 */
  timeout?: number;
}

export interface UseClipboardReturn {
  /** The most recently copied value (or "" if none). */
  value: string;
  /** True for `timeout` ms after a successful copy. */
  copied: boolean;
  /** Copy `text` to the clipboard. Returns true on success. */
  copy: (text: string) => Promise<boolean>;
  /** Reset internal state. */
  reset: () => void;
}

/**
 * useClipboard — copy text to the system clipboard and track the copied state.
 */
export function useClipboard(
  options: UseClipboardOptions = {}
): UseClipboardReturn {
  const { timeout = 2000 } = options;
  const [value, setValue] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = React.useCallback(() => {
    setCopied(false);
    setValue("");
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const copy = React.useCallback(
    async (text: string): Promise<boolean> => {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers / insecure contexts.
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        setValue(text);
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [timeout]
  );

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { value, copied, copy, reset };
}
