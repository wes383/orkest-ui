import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch, type SwitchSize } from './switch';

const sizes: SwitchSize[] = ['sm', 'md', 'lg'];

describe('Switch', () => {
  it('renders a labelled switch with aria-checked', () => {
    render(<Switch label="Notifications" />);

    const control = screen.getByRole('switch', { name: 'Notifications' });
    expect(control).not.toBeChecked();
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles with pointer and keyboard interaction', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Switch label="Notifications" onChange={onChange} />);

    await user.click(screen.getByText('Notifications'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('switch')).toBeChecked();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');

    screen.getByRole('switch').blur();
    await user.tab();
    expect(screen.getByRole('switch')).toHaveFocus();

    await user.keyboard(' ');
    expect(screen.getByRole('switch')).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('supports controlled checked state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Switch label="Controlled" checked onChange={onChange} />);

    const control = screen.getByRole('switch', { name: 'Controlled' });
    expect(control).toBeChecked();

    await user.click(screen.getByText('Controlled'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(control).toBeChecked();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Switch label="Disabled" disabled onChange={onChange} />);

    await user.click(screen.getByText('Disabled'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('forwards form attributes, refs, and size', () => {
    const ref = createRef<HTMLInputElement>();

    const { container } = render(
      <Switch
        ref={ref}
        label="Weekly digest"
        name="digest"
        value="weekly"
        required
        size="lg"
      />,
    );

    const control = screen.getByRole('switch', { name: 'Weekly digest' });
    expect(ref.current).toBe(control);
    expect(control).toHaveAttribute('name', 'digest');
    expect(control).toHaveAttribute('value', 'weekly');
    expect(control).toBeRequired();
    expect(container.querySelector('[data-size="lg"]')).toBeInTheDocument();
  });

  it.each(sizes)('applies the %s size', (size) => {
    const { container } = render(<Switch size={size} label="Size" />);

    expect(container.querySelector(`[data-size="${size}"]`)).toBeInTheDocument();
  });
});
