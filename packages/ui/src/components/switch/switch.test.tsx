import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch, type SwitchSize } from './switch';

const sizes: SwitchSize[] = ['sm', 'md', 'lg'];

describe('Switch', () => {
  it('renders a labelled Base UI switch', () => {
    render(<Switch label="Notifications" />);

    const control = screen.getByRole('switch', { name: 'Notifications' });
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles with pointer and keyboard interaction', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(<Switch label="Notifications" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByText('Notifications'));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('switch')).toHaveAttribute(
      'aria-checked',
      'true',
    );

    screen.getByRole('switch').blur();
    await user.tab();
    expect(screen.getByRole('switch')).toHaveFocus();

    await user.keyboard(' ');
    expect(screen.getByRole('switch')).toHaveAttribute(
      'aria-checked',
      'false',
    );
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it('supports controlled checked state', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Switch
        label="Controlled"
        checked
        onCheckedChange={onCheckedChange}
      />,
    );

    const control = screen.getByRole('switch', { name: 'Controlled' });
    expect(control).toHaveAttribute('aria-checked', 'true');

    await user.click(screen.getByText('Controlled'));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(control).toHaveAttribute('aria-checked', 'true');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Switch label="Disabled" disabled onCheckedChange={onCheckedChange} />,
    );

    await user.click(screen.getByText('Disabled'));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('switch')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('forwards form attributes, refs, and size', () => {
    const ref = createRef<HTMLElement>();
    const inputRef = createRef<HTMLInputElement>();

    const { container } = render(
      <Switch
        ref={ref}
        inputRef={inputRef}
        label="Weekly digest"
        name="digest"
        value="weekly"
        required
        size="lg"
      />,
    );

    const control = screen.getByRole('switch', { name: 'Weekly digest' });
    expect(ref.current).toBe(control);
    expect(inputRef.current).toHaveAttribute('name', 'digest');
    expect(inputRef.current).toHaveAttribute('value', 'weekly');
    expect(inputRef.current).toBeRequired();
    expect(container.querySelector('[data-size="lg"]')).toBeInTheDocument();
  });

  it.each(sizes)('applies the %s size', (size) => {
    const { container } = render(<Switch size={size} label="Size" />);

    expect(container.querySelector(`[data-size="${size}"]`)).toBeInTheDocument();
  });
});
