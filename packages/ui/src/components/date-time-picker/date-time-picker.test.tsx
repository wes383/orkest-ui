import { createRef } from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field, FieldLabel } from '../field';
import { DateTimePicker } from './date-time-picker';

const PLACEHOLDER = 'Select date and time';

async function open(user: ReturnType<typeof userEvent.setup>, name = PLACEHOLDER) {
  await user.click(screen.getByRole('button', { name }));
  return screen.findByRole('dialog', { name: 'Choose date and time' });
}

function day(label: RegExp) {
  return within(screen.getByRole('grid')).getByRole('gridcell', { name: label });
}

describe('DateTimePicker', () => {
  it('shows the placeholder until a value is selected', () => {
    render(<DateTimePicker />);

    expect(screen.getByRole('button', { name: PLACEHOLDER })).toBeInTheDocument();
  });

  it('formats the date and the time together', () => {
    render(<DateTimePicker defaultValue="2026-11-18T09:30" />);

    expect(
      screen.getByRole('button', { name: 'Nov 18, 2026, 09:30' }),
    ).toBeInTheDocument();
  });

  it('renders the time in a 12-hour clock when asked', () => {
    render(<DateTimePicker defaultValue="2026-11-18T09:30" timeFormat="12h" />);

    expect(
      screen.getByRole('button', { name: 'Nov 18, 2026, 9:30 AM' }),
    ).toBeInTheDocument();
  });

  it('keeps the panel open and commits the selected day with the current time', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DateTimePicker defaultValue="2026-11-18T09:30" onChange={onChange} />);
    await open(user, 'Nov 18, 2026, 09:30');

    await user.click(day(/November 20, 2026/));

    expect(onChange).toHaveBeenCalledWith('2026-11-20T09:30');
    expect(screen.getByRole('dialog', { name: 'Choose date and time' })).toBeInTheDocument();
  });

  it('steps the time and commits it with the selected day', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DateTimePicker defaultValue="2026-11-18T09:30" onChange={onChange} />);
    await open(user, 'Nov 18, 2026, 09:30');

    const hours = screen.getByRole('spinbutton', { name: 'Hours' });

    await user.click(hours);
    await user.keyboard('{ArrowUp}');

    expect(onChange).toHaveBeenCalledWith('2026-11-18T10:30');
  });

  it('uses a time typed before the day is picked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DateTimePicker defaultValue="2026-11-18T09:30" onChange={onChange} />);
    await open(user, 'Nov 18, 2026, 09:30');

    const hours = screen.getByRole('spinbutton', { name: 'Hours' });

    await user.click(hours);
    await user.keyboard('14');
    await user.click(day(/November 22, 2026/));

    expect(onChange).toHaveBeenLastCalledWith('2026-11-22T14:30');
  });

  it('fills in the current date and time', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DateTimePicker onChange={onChange} />);
    await open(user);
    await user.click(screen.getByRole('button', { name: 'Now' }));

    expect(onChange).toHaveBeenCalledWith(
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
    );
  });

  it('closes from the Done action', async () => {
    const user = userEvent.setup();

    render(<DateTimePicker defaultValue="2026-11-18T09:30" />);
    await open(user, 'Nov 18, 2026, 09:30');
    await user.click(screen.getByRole('button', { name: 'Done' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('clears the value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DateTimePicker defaultValue="2026-11-18T09:30" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole('button', { name: PLACEHOLDER })).toBeInTheDocument();
  });

  it('keeps its field id and name to itself inside a Field', async () => {
    const user = userEvent.setup();

    render(
      <Field name="publishedAt">
        <FieldLabel>Publish at</FieldLabel>
        <DateTimePicker defaultValue="2026-11-18T09:30" />
      </Field>,
    );
    await open(user, 'Nov 18, 2026, 09:30');

    const ids = Array.from(document.querySelectorAll('[id]')).map((node) => node.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(document.querySelectorAll('input[name="publishedAt"]')).toHaveLength(1);
  });

  it('submits through a hidden input', () => {
    const { container } = render(
      <DateTimePicker defaultValue="2026-11-18T09:30" name="startsAt" />,
    );

    expect(container.querySelector('input[name="startsAt"]')).toHaveValue('2026-11-18T09:30');
  });

  it('forwards class names and refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(<DateTimePicker ref={ref} className="custom" id="starts" />);

    expect(ref.current).toHaveClass('custom');
    expect(screen.getByRole('button', { name: PLACEHOLDER })).toHaveAttribute('id', 'starts');
  });
});
