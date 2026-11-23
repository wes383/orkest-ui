'use client';

import { IconButton } from '@orkest/ui';
import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';

const storageKey = 'orkest-theme';
const themeAttribute = 'data-orkest-theme';
const darkSchemeQuery = '(prefers-color-scheme: dark)';

function readIsDark() {
  const theme = document.documentElement.getAttribute(themeAttribute);

  if (theme === 'dark') {
    return true;
  }

  if (theme === 'light') {
    return false;
  }

  return window.matchMedia(darkSchemeQuery).matches;
}

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [themeAttribute],
  });

  const query = window.matchMedia(darkSchemeQuery);
  query.addEventListener('change', onChange);

  return () => {
    observer.disconnect();
    query.removeEventListener('change', onChange);
  };
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribeToTheme, readIsDark, () => false);

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';

    document.documentElement.setAttribute(themeAttribute, next);

    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      // Theme still changes for the current page when storage is unavailable.
    }
  }

  return (
    <IconButton
      className="header-icon"
      icon={isDark ? Sun : Moon}
      label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
    />
  );
}
