import { getPrimitiveTokensByPrefix } from '@/lib/tokens';

export function SpacingScale() {
  const tokens = getPrimitiveTokensByPrefix('--ok-space-');

  return (
    <div className="spacing-scale">
      {tokens.map((token) => (
        <div className="spacing-row" key={token.name}>
          <code className="spacing-label">{token.name.replace('--ok-space-', 'space-')}</code>
          <span className="spacing-track">
            <span className="spacing-bar" style={{ width: `var(${token.name})` }} />
          </span>
          <span className="spacing-value">{token.value}</span>
        </div>
      ))}
    </div>
  );
}
