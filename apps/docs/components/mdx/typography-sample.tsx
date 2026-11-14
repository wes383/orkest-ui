import { Text } from '@orkest/ui';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export function TypographySample() {
  return (
    <div className="typography-sample">
      {sizes.map((size) => (
        <div className="typography-row" key={size}>
          <code className="typography-label">{size}</code>
          <Text size={size}>Design with clarity and restraint.</Text>
        </div>
      ))}
    </div>
  );
}

export function FontFamilySample() {
  return (
    <div className="font-sample-grid">
      <div className="font-sample">
        <p className="font-sample-label">Sans · Inter</p>
        <Text size="lg" weight="medium">
          The quick brown fox jumps over the lazy dog.
        </Text>
        <p className="font-sample-cjk">
          <Text size="md" tone="muted">
            统一字体，清晰克制。
          </Text>
        </p>
        <code className="font-sample-token">--ok-font-sans</code>
      </div>

      <div className="font-sample">
        <p className="font-sample-label">Display · Plus Jakarta Sans</p>
        <Text
          font="display"
          size="xl"
          weight="semibold"
          style={{
            fontSize: 'var(--ok-font-size-4xl)',
            lineHeight: 'var(--ok-line-height-tight)',
          }}
        >
          Build with clarity.
        </Text>
        <code className="font-sample-token">--ok-font-display</code>
      </div>

      <div className="font-sample">
        <p className="font-sample-label">Mono · JetBrains Mono</p>
        <Text font="mono" size="md">
          const ui = &quot;orkest&quot;;
        </Text>
        <code className="font-sample-token">--ok-font-mono</code>
      </div>
    </div>
  );
}
