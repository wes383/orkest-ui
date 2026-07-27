"use client";

import * as React from "react";
import { dict, type Lang } from "@/lib/i18n";

/**
 * LanguageProvider — runtime ZH/EN switching with localStorage persistence.
 *
 * - Persists choice to `orkest-lang` (written to both localStorage and a cookie).
 * - The server can inject the cookie value via `initialLang` as the first-paint
 *   render language to eliminate flash.
 * - Updates `<html lang>` for accessibility / SEO.
 * - Hydration-safe: server and first-paint client render the same `initialLang` value.
 */

const STORAGE_KEY = "orkest-lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
  /** SSR first-paint language; should be read from the cookie in layout.tsx and passed in. Defaults to "zh". */
  initialLang?: Lang;
}

export function LanguageProvider({
  children,
  initialLang = "zh",
}: LanguageProviderProps) {
  // Render the cookie-inferred language on first paint to avoid hydration mismatch and flash.
  const [lang, setLangState] = React.useState<Lang>(initialLang);

  React.useEffect(() => {
    // After client mount, correct once from localStorage (in case it disagrees with the cookie).
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "zh" || stored === "en" && stored !== lang) {
        setLangState(stored);
      }
    } catch {
      /* ignore: localStorage unavailable */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    }
  }, [lang]);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      // Also write the cookie so the next SSR can read the correct value.
      document.cookie = `${STORAGE_KEY}=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLang = React.useCallback(() => {
    setLangState((prev) => {
      const next = prev === "zh" ? "en" : "zh";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
        document.cookie = `${STORAGE_KEY}=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  /**
   * Translation function: flattens the current dictionary into a Map (rebuilt once
   * per lang switch), reducing `t()` lookups from O(path depth) to O(1).
   * Missing keys console.warn in dev to avoid silently falling back to the key itself.
   */
  const flatMap = React.useMemo(() => {
    const map = new Map<string, string>();
    const walk = (obj: unknown, prefix: string) => {
      if (typeof obj === "string") {
        map.set(prefix, obj);
        return;
      }
      if (obj && typeof obj === "object") {
        for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
          walk(v, prefix ? `${prefix}.${k}` : k);
        }
      }
    };
    walk(dict[lang], "");
    return map;
  }, [lang]);

  const t = React.useCallback(
    (key: string) => {
      const hit = flatMap.get(key);
      if (hit !== undefined) return hit;
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[i18n] missing key: "${key}" (${lang})`);
      }
      return key;
    },
    [flatMap, lang]
  );

  const value = React.useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within <LanguageProvider>");
  }
  return ctx;
}

export function useLang() {
  return useLanguage().lang;
}

export function useT() {
  return useLanguage().t;
}
