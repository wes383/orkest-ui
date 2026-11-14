'use client';

import { Icon } from '@orkest/ui';
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

type CopyState = 'idle' | 'copied' | 'error';

export function CopyButton({ code }: { code: string }) {
  const [state, setState] = useState<CopyState>('idle');

  useEffect(() => {
    if (state === 'idle') {
      return;
    }

    const timer = window.setTimeout(() => setState('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setState('copied');
    } catch {
      setState('error');
    }
  }

  return (
    <>
      <button type="button" className="copy-button" onClick={copyCode} aria-label="Copy code">
        <Icon icon={state === 'copied' ? Check : Copy} size="sm" />
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === 'copied'
          ? 'Code copied to clipboard.'
          : state === 'error'
            ? 'Unable to copy code.'
            : ''}
      </span>
    </>
  );
}
