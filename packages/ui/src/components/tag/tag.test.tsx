import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Check, Circle } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { Tag, type TagSize, type TagVariant } from './tag';

const variants: TagVariant[] = [
  'default',
  'info',
  'success',
  'warning',
  'destructive',
  'outline',
];

const sizes: TagSize[] = ['sm', 'md', 'lg'];

describe('Tag', () => {
  it('renders a span with the default attributes', () => {
    render(<Tag>Default</Tag>);

    const tag = screen.getByText('Default');
    expect(tag.tagName).toBe('SPAN');
    expect(tag).toHaveAttribute('data-variant', 'default');
    expect(tag).toHaveAttribute('data-size', 'md');
    expect(tag).toHaveAttribute('data-shape', 'pill');
    expect(tag).not.toHaveAttribute('data-interactive');
  });

  it.each(variants)('applies the %s variant', (variant) => {
    render(<Tag variant={variant}>Tag</Tag>);

    expect(screen.getByText('Tag')).toHaveAttribute('data-variant', variant);
  });

  it.each(sizes)('applies the %s size', (size) => {
    render(<Tag size={size}>Tag</Tag>);

    expect(screen.getByText('Tag')).toHaveAttribute('data-size', size);
  });

  it('supports rounded and pill shapes', () => {
    const { rerender } = render(<Tag shape="rounded">Tag</Tag>);
    expect(screen.getByText('Tag')).toHaveAttribute('data-shape', 'rounded');

    rerender(<Tag>Tag</Tag>);
    expect(screen.getByText('Tag')).toHaveAttribute('data-shape', 'pill');
  });

  it('renders leading and trailing icons as decorative', () => {
    const { container } = render(
      <Tag leftIcon={Circle} rightIcon={Check}>
        Tag
      </Tag>,
    );

    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(2);

    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('renders a leading status dot', () => {
    const { container } = render(<Tag dot>Active</Tag>);

    expect(container.querySelector('[data-dot="true"]')).toBeInTheDocument();
  });

  it('renders a removable action', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <Tag removable onRemove={onRemove}>
        Design
      </Tag>,
    );

    await user.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Design').tagName).toBe('SPAN');
  });

  it('renders an interactive tag as a button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Tag interactive onClick={onClick}>
        Tag
      </Tag>,
    );

    const tag = screen.getByRole('button', { name: 'Tag' });
    expect(tag.tagName).toBe('BUTTON');
    expect(tag).toHaveAttribute('type', 'button');
    expect(tag).toHaveAttribute('data-interactive', 'true');

    await user.click(tag);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not treat removable tags as interactive', () => {
    render(
      <Tag interactive removable>
        Tag
      </Tag>,
    );

    expect(screen.queryByRole('button', { name: 'Tag' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('disables interactive tags and their remove action', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onRemove = vi.fn();

    const { rerender } = render(
      <Tag interactive disabled onClick={onClick}>
        Tag
      </Tag>,
    );

    expect(screen.getByRole('button', { name: 'Tag' })).toBeDisabled();

    rerender(
      <Tag removable disabled onRemove={onRemove}>
        Tag
      </Tag>,
    );

    const remove = screen.getByRole('button', { name: 'Remove' });
    expect(remove).toBeDisabled();

    await user.click(remove);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('applies a custom color', () => {
    render(<Tag color="rebeccapurple">Custom</Tag>);

    const tag = screen.getByText('Custom');
    expect(tag).toHaveAttribute('data-custom', 'true');
    expect(tag.style.getPropertyValue('--chip-custom-color')).toBe('rebeccapurple');
  });

  it('forwards native attributes, class names, and refs', () => {
    const ref = createRef<HTMLSpanElement | HTMLButtonElement>();

    render(
      <Tag ref={ref} id="tag" className="custom" aria-label="Tag">
        Active
      </Tag>,
    );

    const tag = screen.getByText('Active');
    expect(tag).toHaveAttribute('aria-label', 'Tag');
    expect(tag).toHaveAttribute('id', 'tag');
    expect(tag).toHaveClass('custom');
    expect(ref.current).toBe(tag);
  });
});
