"use client";

import * as React from "react";

/**
 * useDebounce — returns a debounced copy of `value` that only updates
 * after `delay` ms have elapsed without changes.
 *
 * @example
 * const [query, setQuery] = useState("");
 * const debounced = useDebounce(query, 300);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export interface UseDebouncedCallbackOptions {
  /** Delay in ms. @default 300 */
  delay?: number;
  /** When true, the leading call happens immediately. @default false */
  leading?: boolean;
  /** When true, the trailing call happens after the delay. @default true */
  trailing?: boolean;
  /** When true, the callback is also called on unmount/remount. @default false */
  flushOnUnmount?: boolean;
}

/**
 * useDebouncedCallback — returns a debounced version of `callback`.
 *
 * @example
 * const handleSearch = useDebouncedCallback((q: string) => fetch(q), 300);
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  options: UseDebouncedCallbackOptions | number = {}
): T & { cancel: () => void; flush: () => void } {
  const opts: UseDebouncedCallbackOptions =
    typeof options === "number" ? { delay: options } : options;
  const { delay = 300, leading = false, trailing = true } = opts;

  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const argsRef = React.useRef<Parameters<T> | null>(null);
  const didLeadingCallRef = React.useRef(false);

  const cancel = React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    argsRef.current = null;
    didLeadingCallRef.current = false;
  }, []);

  const flush = React.useCallback(() => {
    if (timerRef.current && argsRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      callbackRef.current(...argsRef.current);
      argsRef.current = null;
      didLeadingCallRef.current = false;
    }
  }, []);

  const debounced = React.useCallback(
    (...args: Parameters<T>) => {
      argsRef.current = args;
      if (leading && !didLeadingCallRef.current) {
        callbackRef.current(...args);
        didLeadingCallRef.current = true;
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      if (trailing) {
        timerRef.current = setTimeout(() => {
          if (argsRef.current) callbackRef.current(...argsRef.current);
          argsRef.current = null;
          timerRef.current = null;
          didLeadingCallRef.current = false;
        }, delay);
      }
    },
    [delay, leading, trailing]
  ) as T & { cancel: () => void; flush: () => void };

  debounced.cancel = cancel;
  debounced.flush = flush;

  React.useEffect(() => () => cancel(), [cancel]);

  return debounced;
}
