import { needsSwatchOutline } from '@/lib/color';
import { getPrimitiveColorGroups, type ColorFamily } from '@/lib/tokens';

export function ColorPalette({ family }: { family: ColorFamily }) {
  const group = getPrimitiveColorGroups().find((item) => item.family === family);

  if (!group) {
    throw new Error(`Unknown color family: ${family}`);
  }

  return (
    <div className="color-grid">
      {group.tokens.map((token) => (
        <div className="color-swatch" key={token.name}>
          <span
            className={
              needsSwatchOutline(token.value)
                ? 'color-swatch-chip color-swatch-chip-outlined'
                : 'color-swatch-chip'
            }
            style={{ backgroundColor: `var(${token.name})` }}
            aria-hidden="true"
          />
          <span className="color-swatch-meta">
            <code className="color-swatch-name">{token.name.replace('--ok-color-', '')}</code>
            <span className="color-swatch-value">{token.value}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
