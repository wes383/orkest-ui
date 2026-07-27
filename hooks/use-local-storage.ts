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
 * Cross-tab sync is enabled by default via the `storage` event.
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
  const didRead = React.useRef(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore parse / availability errors
    }
    didRead.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // ignore write errors (quota, private mode, etc.)
        }
        return resolved;
      });
    },
    [key]
  );

  const remove = React.useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setValue(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  React.useEffect(() => {
    if (!syncAcrossTabs) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        if (e.newValue === null) {
          setValue(initialValue);
        } else {
          setValue(JSON.parse(e.newValue) as T);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, initialValue, syncAcrossTabs]);

  // Avoid lint complaints about unread ref.
  void didRead;

  return [value, set, remove];
}
