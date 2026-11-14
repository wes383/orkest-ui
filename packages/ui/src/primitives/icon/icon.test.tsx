import { render, screen } from '@testing-library/react';
import { Circle } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { Icon } from './icon';

describe('Icon', () => {
  it('renders a decorative icon by default', () => {
    render(<Icon icon={Circle} data-testid="icon" />);

    const icon = screen.getByTestId('icon');
    expect(icon.tagName.toLowerCase()).toBe('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('focusable', 'false');
    expect(icon).not.toHaveAttribute('role');
  });

  it('exposes an accessible name when a label is provided', () => {
    render(<Icon icon={Circle} label="Status" />);

    const icon = screen.getByRole('img', { name: 'Status' });
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('applies the requested size and stroke width', () => {
    render(<Icon icon={Circle} data-testid="icon" size="lg" strokeWidth={2.5} />);

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-size', 'lg');
    expect(icon.style.getPropertyValue('--ok-icon-stroke-width')).toBe('2.5');
  });

  it('forwards native attributes and custom class names', () => {
    render(<Icon icon={Circle} id="status-icon" className="custom" data-state="active" />);

    const icon = document.getElementById('status-icon');
    expect(icon).toHaveClass('custom');
    expect(icon).toHaveAttribute('data-state', 'active');
  });
});
