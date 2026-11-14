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

  return (
    <div className="code-block">
      <CopyButton code={code} />
      <div className="code-block-content" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
