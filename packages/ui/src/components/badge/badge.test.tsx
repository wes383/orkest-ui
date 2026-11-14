import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { Check, Circle } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { Badge, type BadgeSize, type BadgeVariant } from './badge';

const variants: BadgeVariant[] = [
  'default',
  'info',
  'success',
  'warning',
  'destructive',
  'outline',
];

const sizes: BadgeSize[] = ['sm', 'md', 'lg'];

describe('Badge', () => {
  it('renders a span with the default attributes', () => {
    render(<Badge>Default</Badge>);

    const badge = screen.getByText('Default');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveAttribute('data-variant', 'default');
    expect(badge).toHaveAttribute('data-size', 'md');
    expect(badge).toHaveAttribute('data-shape', 'rounded');
    expect(badge).not.toHaveAttribute('data-dot-only');
  });

  it.each(variants)('applies the %s variant', (variant) => {
    render(<Badge variant={variant}>Tag</Badge>);

    expect(screen.getByText('Tag')).toHaveAttribute('data-variant', variant);
  });

  it.each(sizes)('applies the %s size', (size) => {
    render(<Badge size={size}>Tag</Badge>);

    expect(screen.getByText('Tag')).toHaveAttribute('data-size', size);
  });

  it('supports rounded and pill shapes', () => {
    const { rerender } = render(<Badge>Tag</Badge>);
    expect(screen.getByText('Tag')).toHaveAttribute('data-shape', 'rounded');

    rerender(<Badge shape="pill">Tag</Badge>);
    expect(screen.getByText('Tag')).toHaveAttribute('data-shape', 'pill');
  });

  it('renders leading and trailing icons as decorative', () => {
    const { container } = render(
      <Badge leftIcon={Circle} rightIcon={Check}>
        Tag
      </Badge>,
    );

    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(2);

    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('renders a leading status dot', () => {
    const { container } = render(<Badge dot>Online</Badge>);

    expect(container.querySelector('[data-dot="true"]')).toBeInTheDocument();
    expect(screen.getByText('Online')).not.toHaveAttribute('data-dot-only');
  });

  it('renders a standalone dot with an accessible name', () => {
    const { container } = render(<Badge dot variant="success" aria-label="Online" />);

    const badge = container.querySelector('[data-dot-only="true"]');
    expect(badge).toHaveAttribute('aria-label', 'Online');
    expect(badge?.querySelector('[data-dot="true"]')).toBeInTheDocument();
  });

  it('renders count values with a maximum', () => {
    const { rerender } = render(<Badge count={8} />);
    expect(screen.getByText('8')).toBeInTheDocument();

    rerender(<Badge count={120} maxCount={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();

    rerender(<Badge count={120} maxCount={200} />);
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('applies a custom color', () => {
    render(<Badge color="rebeccapurple">Custom</Badge>);

    const badge = screen.getByText('Custom');
    expect(badge).toHaveAttribute('data-custom', 'true');
    expect(badge.style.getPropertyValue('--chip-custom-color')).toBe('rebeccapurple');
  });

  it('forwards native attributes, class names, and refs', () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Badge ref={ref} id="status" className="custom" aria-label="Status">
        Active
      </Badge>,
    );

    const badge = screen.getByText('Active');
    expect(badge).toHaveAttribute('aria-label', 'Status');
    expect(badge).toHaveAttribute('id', 'status');
    expect(badge).toHaveClass('custom');
    expect(ref.current).toBe(badge);
  });
});
