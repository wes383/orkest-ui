import { createRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { OTPInput } from './otp-input';

function getSlots() {
  return screen.getAllByRole('textbox') as HTMLInputElement[];
}

function getSlotValues() {
  return getSlots().map((slot) => slot.value);
}

describe('OTPInput', () => {
  it('renders one slot per length and labels the group', () => {
    render(<OTPInput length={6} aria-label="Verification code" />);

    expect(screen.getByRole('group', { name: 'Verification code' })).toBeInTheDocument();
    expect(getSlots()).toHaveLength(6);
  });

  it('fills slots while typing and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<OTPInput length={4} aria-label="Verification code" onValueChange={onValueChange} />);

    const [first] = getSlots();
    if (!first) {
      throw new Error('Expected an OTP slot');
    }

    await user.type(first, '1234');

    expect(getSlotValues()).toEqual(['1', '2', '3', '4']);
    expect(onValueChange).toHaveBeenLastCalledWith(
      '1234',
      expect.objectContaining({ reason: 'input-change' }),
    );
  });

  it('calls onValueComplete when every slot is filled', async () => {
    const user = userEvent.setup();
    const onValueComplete = vi.fn();

    render(
      <OTPInput length={4} aria-label="Verification code" onValueComplete={onValueComplete} />,
    );

    const [first] = getSlots();
    if (!first) {
      throw new Error('Expected an OTP slot');
    }

    await user.type(first, '1234');

    await waitFor(() => {
      expect(onValueComplete).toHaveBeenCalledWith(
        '1234',
        expect.objectContaining({ reason: 'input-change' }),
      );
    });
  });

  it('renders an uncontrolled default value', () => {
    render(<OTPInput length={4} defaultValue="12" aria-label="Verification code" />);

    expect(getSlotValues()).toEqual(['1', '2', '', '']);
  });

  it('keeps a controlled value until the parent updates it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <OTPInput
        length={4}
        value="12"
        aria-label="Verification code"
        onValueChange={onValueChange}
      />,
    );

    const [first] = getSlots();
    if (!first) {
      throw new Error('Expected an OTP slot');
    }

    await user.type(first, '3');

    expect(onValueChange).toHaveBeenCalledWith(
      '32',
      expect.objectContaining({ reason: 'input-change' }),
    );
    expect(getSlotValues()).toEqual(['1', '2', '', '']);
  });

  it('masks every slot when mask is enabled', () => {
    const { container } = render(<OTPInput length={6} mask aria-label="Verification code" />);

    expect(container.querySelectorAll('input[type="password"]')).toHaveLength(6);
  });

  it('disables every slot', () => {
    render(<OTPInput length={4} disabled aria-label="Verification code" />);

    expect(screen.getByRole('group')).toHaveAttribute('data-disabled');

    for (const slot of getSlots()) {
      expect(slot).toBeDisabled();
    }
  });

  it('makes every slot read-only', () => {
    render(<OTPInput length={4} readOnly aria-label="Verification code" />);

    expect(screen.getByRole('group')).toHaveAttribute('data-readonly');

    for (const slot of getSlots()) {
      expect(slot).toHaveAttribute('readonly');
    }
  });

  it('renders a separator between groups of three slots', () => {
    render(
      <OTPInput
        length={6}
        separator={<span aria-hidden="true">-</span>}
        aria-label="Verification code"
      />,
    );

    expect(screen.getAllByRole('separator')).toHaveLength(1);
  });

  it('forwards class names and the root ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<OTPInput ref={ref} length={4} className="custom" aria-label="Verification code" />);

    expect(ref.current).toBe(screen.getByRole('group', { name: 'Verification code' }));
    expect(ref.current).toHaveClass('custom');
  });
});
