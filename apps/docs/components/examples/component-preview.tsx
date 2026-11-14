import type { ReactNode } from 'react';
import type { BundledLanguage } from 'shiki';

import { CodeBlock } from './code-block';

export function ComponentPreview({
  children,
  code,
  title = 'Example',
  language = 'tsx',
}: {
  children: ReactNode;
  code: string;
  title?: string;
  language?: BundledLanguage;
}) {
  return (
    <>
      <div className="component-preview">
        <div className="preview-toolbar">
          <span className="preview-label">
            <span className="preview-dot" aria-hidden="true" />
            {title}
          </span>
          <span className="preview-source">@orkest/ui</span>
        </div>
        <div className="preview-canvas">{children}</div>
      </div>
      <CodeBlock code={code} language={language} />
    </>
  );
}
