import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox, type CheckboxSize } from './checkbox';

const sizes: CheckboxSize[] = ['sm', 'md', 'lg'];

describe('Checkbox', () => {
  it('renders a labelled Base UI checkbox', () => {
    render(<Checkbox label="Accept terms" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).not.toHaveAttribute('aria-disabled');
  });

  it('supports uncontrolled and controlled checked state', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    const { unmount } = render(
      <Checkbox
        label="Default checked"
        defaultChecked
        onCheckedChange={onCheckedChange}
      />,
    );

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByText('Default checked'));
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(false);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
    unmount();

    render(
      <Checkbox
        label="Controlled checked"
        checked
        onCheckedChange={onCheckedChange}
      />,
    );
    expect(
      screen.getByRole('checkbox', { name: 'Controlled checked' }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('exposes an independent indeterminate state', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Checkbox
        label="Select all"
        indeterminate
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Select all' });
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox).not.toHaveAttribute('data-checked');

    await user.click(screen.getByText('Select all'));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  });

  it('blocks interaction when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Checkbox label="Disabled" disabled onCheckedChange={onCheckedChange} />,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Disabled' });
    expect(checkbox).toHaveAttribute('aria-disabled', 'true');

    await user.click(screen.getByText('Disabled'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('forwards form attributes to the hidden input', () => {
    const inputRef = createRef<HTMLInputElement>();

    render(
      <Checkbox
        label="Newsletter"
        inputRef={inputRef}
        name="newsletter"
        value="weekly"
        required
        aria-describedby="newsletter-help"
      />,
    );

    const input = inputRef.current;
    expect(input).toHaveAttribute('name', 'newsletter');
    expect(input).toHaveAttribute('value', 'weekly');
    expect(input).toBeRequired();
    expect(
      screen.getByRole('checkbox', { name: 'Newsletter' }),
    ).toHaveAttribute('aria-describedby', 'newsletter-help');
  });

  it.each(sizes)('applies the %s size', (size) => {
    const { container } = render(<Checkbox size={size} label="Size" />);

    expect(container.querySelector(`[data-size="${size}"]`)).toBeInTheDocument();
  });

  it('forwards refs to the control and merges class names', () => {
    const ref = createRef<HTMLElement>();
    const inputRef = createRef<HTMLInputElement>();

    render(
      <Checkbox
        ref={ref}
        inputRef={inputRef}
        label="Ref"
        className="custom"
        id="terms"
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Ref' });
    expect(ref.current).toBe(checkbox);
    expect(inputRef.current).toHaveAttribute('id', 'terms');
    expect(checkbox.closest('label')).toHaveClass('custom');
  });

  it('toggles with the Space key', async () => {
    const user = userEvent.setup();

    render(<Checkbox label="Keyboard" />);
    await user.tab();
    await user.keyboard(' ');

    expect(screen.getByRole('checkbox', { name: 'Keyboard' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });
});
