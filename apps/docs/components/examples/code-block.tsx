import type { BundledLanguage } from 'shiki';

import { highlightCode } from '@/lib/highlight';

import { CopyButton } from './copy-button';

export async function CodeBlock({
  code,
  language = 'tsx',
}: {
  code: string;
  language?: BundledLanguage;
}) {
  const html = await highlightCode(code, language);
  const isSingleLine = !code.trimEnd().includes('\n');

  return (
    <div
      className={isSingleLine ? 'code-block code-block-single-line' : 'code-block'}
      data-language={language}
    >
      <CopyButton code={code} />
      <div className="code-block-content" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
