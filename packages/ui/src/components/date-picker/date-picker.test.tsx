import { createRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DatePicker } from './date-picker';

async function open(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.click(screen.getByRole('button', { name }));
  return screen.findByRole('dialog', { name: 'Choose a date' });
}

describe('DatePicker', () => {
  it('shows the placeholder until a date is selected', () => {
    render(<DatePicker />);

    expect(screen.getByRole('button', { name: 'Select a date' })).toBeInTheDocument();
  });

  it('formats the selected value with the default medium style', () => {
    render(<DatePicker defaultValue="2026-11-18" />);

    expect(screen.getByRole('button', { name: 'Nov 18, 2026' })).toBeInTheDocument();
  });

  it('accepts a custom formatter', () => {
    render(<DatePicker defaultValue="2026-11-18" format={(value) => `due ${value}`} />);

    expect(screen.getByRole('button', { name: 'due 2026-11-18' })).toBeInTheDocument();
  });

  it('opens a calendar and reports the picked date', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DatePicker defaultValue="2026-11-10" onChange={onChange} />);
    await open(user, 'Nov 10, 2026');

    const calendar = await screen.findByRole('grid', { name: 'November 2026' });
    expect(calendar).toBeInTheDocument();

    await user.click(screen.getByRole('gridcell', { name: /November 20, 2026/ }));

    expect(onChange).toHaveBeenCalledWith('2026-11-20');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('keeps the value controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DatePicker value="2026-11-10" onChange={onChange} />);
    await open(user, 'Nov 10, 2026');
    await user.click(screen.getByRole('gridcell', { name: /November 20, 2026/ }));

    expect(onChange).toHaveBeenCalledWith('2026-11-20');
    expect(screen.getByRole('button', { name: 'Nov 10, 2026' })).toBeInTheDocument();
  });

  it('clears the value from the inline action', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DatePicker defaultValue="2026-11-18" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Clear date' }));

    expect(onChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole('button', { name: 'Select a date' })).toBeInTheDocument();
  });

  it('hides the clear action when clearable is false', () => {
    render(<DatePicker defaultValue="2026-11-18" clearable={false} />);

    expect(screen.queryByRole('button', { name: 'Clear date' })).not.toBeInTheDocument();
  });

  it('selects today from the footer shortcut', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DatePicker onChange={onChange} />);
    await open(user, 'Select a date');
    await user.click(screen.getByRole('button', { name: 'Today' }));

    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/));
  });

  it('blocks dates outside the range', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DatePicker
        defaultValue="2026-11-10"
        minDate="2026-11-05"
        maxDate="2026-11-20"
        disabledDates={['2026-11-12']}
        onChange={onChange}
      />,
    );
    await open(user, 'Nov 10, 2026');

    expect(screen.getByRole('gridcell', { name: /November 4, 2026/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('gridcell', { name: /November 12, 2026/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('does not open while disabled', async () => {
    const user = userEvent.setup();

    render(<DatePicker defaultValue="2026-11-10" disabled />);
    await user.click(screen.getByRole('button', { name: 'Nov 10, 2026' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('submits through a hidden input', () => {
    const { container } = render(
      <DatePicker defaultValue="2026-11-18" name="dueDate" />,
    );

    expect(container.querySelector('input[name="dueDate"]')).toHaveValue('2026-11-18');
  });

  it('forwards class names and refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(<DatePicker ref={ref} className="custom" id="due" />);

    expect(ref.current).toHaveClass('custom');
    expect(screen.getByRole('button', { name: 'Select a date' })).toHaveAttribute(
      'id',
      'due',
    );
  });
});
