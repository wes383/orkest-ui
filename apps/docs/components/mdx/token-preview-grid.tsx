import type { CSSProperties } from 'react';

import { getPrimitiveTokensByPrefix } from '@/lib/tokens';

export function TokenPreviewGrid({
  prefix,
  kind,
}: {
  prefix: string;
  kind: 'radius' | 'shadow';
}) {
  const tokens = getPrimitiveTokensByPrefix(prefix);

  return (
    <div className="token-preview-grid">
      {tokens.map((token) => {
        const style: CSSProperties =
          kind === 'radius'
            ? { borderRadius: `var(${token.name})` }
            : { boxShadow: `var(${token.name})` };

        return (
          <div className="token-preview" key={token.name} style={style}>
            <span className="token-preview-label">{token.name.replace('--ok-', '')}</span>
            <span className="token-preview-value">{token.value}</span>
          </div>
        );
      })}
    </div>
  );
}
