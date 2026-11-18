'use client';

import { Icon } from '@orkest/ui';
import { Check, CircleAlert, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

import { articleToMarkdown } from '@/lib/markdown-export';

type CopyState = 'idle' | 'copied' | 'error';

const icons: Record<CopyState, typeof Copy> = {
  idle: Copy,
  copied: Check,
  error: CircleAlert,
};

export function CopyMarkdownButton() {
  const [state, setState] = useState<CopyState>('idle');

  useEffect(() => {
    if (state === 'idle') {
      return;
    }

    const timer = window.setTimeout(() => setState('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function copyMarkdown() {
    const article = document.querySelector<HTMLElement>('.doc-article');

    if (!article) {
      setState('error');
      return;
    }

    try {
      await navigator.clipboard.writeText(articleToMarkdown(article));
      setState('copied');
    } catch {
      setState('error');
    }
  }

  return (
    <>
      <button
        type="button"
        className="page-copy"
        data-state={state}
        onClick={copyMarkdown}
        aria-label="Copy the page as Markdown"
      >
        <Icon icon={icons[state]} size="sm" />
        <span className="page-copy-label">Copy as Markdown</span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === 'copied'
          ? 'Page copied to clipboard as Markdown.'
          : state === 'error'
            ? 'Unable to copy the page.'
            : ''}
      </span>
    </>
  );
}
