import type { BundledLanguage } from 'shiki';

import { highlightCode } from '@/lib/highlight';

import { CopyButton } from './copy-button';

export async function CodeBlock({
  code,
  language = 'tsx',
  filename,
}: {
  code: string;
  language?: BundledLanguage;
  filename?: string;
}) {
  const html = await highlightCode(code, language);

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-label">{filename ?? language}</span>
        <CopyButton code={code} />
      </div>
      <div className="code-block-content" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
