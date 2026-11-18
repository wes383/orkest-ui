'use client';

import { Icon } from '@orkest/ui';
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

import { articleToMarkdown } from '@/lib/markdown-export';

type CopyState = 'idle' | 'copied' | 'error';

const labels: Record<CopyState, string> = {
  idle: 'Copy as Markdown',
  copied: 'Copied',
  error: 'Copy failed',
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
        title="Copy the page as Markdown"
        aria-label="Copy the page as Markdown"
      >
        <Icon icon={state === 'copied' ? Check : Copy} size="sm" />
        <span className="page-copy-label">{labels[state]}</span>
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
