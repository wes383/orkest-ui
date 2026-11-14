'use client';

import { Icon } from '@orkest/ui';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const storageKey = 'orkest-theme';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-orkest-theme');
    setTheme(current === 'dark' ? 'dark' : 'light');
  }, []);

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute('data-orkest-theme') === 'dark' ? 'dark' : 'light';
    const next: Theme = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-orkest-theme', next);

    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      // Theme still changes for the current page when storage is unavailable.
    }

    setTheme(next);
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Icon icon={isDark ? Sun : Moon} size="sm" />
    </button>
  );
}
