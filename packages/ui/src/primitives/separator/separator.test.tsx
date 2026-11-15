import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Separator, type SeparatorVariant } from './separator';

const variants: SeparatorVariant[] = ['solid', 'dashed', 'dotted'];

describe('Separator', () => {
  it('renders a decorative horizontal separator by default', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator.tagName).toBe('DIV');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    expect(separator).toHaveAttribute('data-variant', 'solid');
    expect(separator).toHaveAttribute('aria-hidden', 'true');
    expect(separator).not.toHaveAttribute('role');
    expect(separator).not.toHaveAttribute('aria-orientation');
  });

  it('exposes separator semantics when not decorative', () => {
    render(<Separator decorative={false} />);

    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
    expect(separator).not.toHaveAttribute('aria-hidden');
  });

  it('sets the vertical orientation in the accessibility tree', () => {
    render(<Separator decorative={false} orientation="vertical" />);

    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    expect(screen.getByRole('separator')).toHaveAttribute('data-orientation', 'vertical');
  });

  it('switches between decorative and semantic modes', () => {
    const { rerender } = render(<Separator decorative={false} data-testid="separator" />);
    expect(screen.getByRole('separator')).toBeInTheDocument();

    rerender(<Separator decorative data-testid="separator" />);
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(screen.getByTestId('separator')).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(variants)('applies the %s variant', (variant) => {
    render(<Separator variant={variant} data-testid="separator" />);

    expect(screen.getByTestId('separator')).toHaveAttribute('data-variant', variant);
  });

  it('forwards native attributes, class names, and refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Separator
        ref={ref}
        id="divider"
        className="custom"
        data-testid="separator"
        style={{ marginTop: 8 }}
      />,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('id', 'divider');
    expect(separator).toHaveClass('custom');
    expect(separator.style.marginTop).toBe('8px');
    expect(ref.current).toBe(separator);
  });
});
