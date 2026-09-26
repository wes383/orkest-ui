"use client";

import * as React from "react";

export interface UseLocalStorageOptions {
  /** Sync state across browser tabs via the `storage` event. @default true */
  syncAcrossTabs?: boolean;
}

/**
 * useLocalStorage — SSR-safe persistent state backed by `window.localStorage`.
 *
 * Reads happen on mount (not during render) to avoid hydration mismatches.
 * Writes happen synchronously in `set` (never inside a state updater, so
 * StrictMode double-invocation cannot write twice). Cross-tab sync is enabled
 * by default via the `storage` event.
 *
 * @example
 * const [name, setName, remove] = useLocalStorage("name", "Anonymous");
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const { syncAcrossTabs = true } = options;

  // Start with the initial value during SSR & first paint.
  const [value, setValue] = React.useState<T>(initialValue);
  // Mirror of the latest value so functional updates chain correctly even
  // when several `set` calls happen in the same tick.
  const valueRef = React.useRef(value);
  React.useEffect(() => {
    valueRef.current = value;
  });

  const write = React.useCallback((next: T) => {
    valueRef.current = next;
    setValue(next);
  }, []);

  const set = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (p: T) => T)(valueRef.current)
          : next;
      write(resolved);
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // ignore write errors (quota, private mode, etc.)
      }
    },
    [key, write]
  );

  const remove = React.useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    write(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, write]);

  // Read once on mount / key change (never during render, SSR-safe).
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) write(JSON.parse(raw) as T);
    } catch {
      // ignore parse / availability errors
    }
  }, [key, write]);

  React.useEffect(() => {
    if (!syncAcrossTabs) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        if (e.newValue === null) {
          write(initialValue);
        } else {
          write(JSON.parse(e.newValue) as T);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, initialValue, syncAcrossTabs, write]);

  return [value, set, remove];
}
