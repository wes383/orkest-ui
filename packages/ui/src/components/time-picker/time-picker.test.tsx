import { createRef } from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TimePicker, TimePickerColumn } from './time-picker';

function getInput() {
  return screen.getByRole('textbox');
}

async function openPanel(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Open time picker' }));
  return screen.findByRole('dialog', { name: 'Choose a time' });
}

describe('TimePicker', () => {
  it('renders the stored value in 24-hour form', () => {
    render(<TimePicker defaultValue="09:30" />);

    expect(getInput()).toHaveValue('09:30');
  });

  it('renders a 12-hour display without changing the value', () => {
    const onChange = vi.fn();

    render(<TimePicker defaultValue="13:45" format="12h" onChange={onChange} />);

    expect(getInput()).toHaveValue('1:45 PM');
  });

  it('opens the panel from a single clock action on the leading side', () => {
    render(<TimePicker defaultValue="09:30" />);

    const triggers = screen.getAllByRole('button', { name: 'Open time picker' });

    expect(triggers).toHaveLength(1);
    expect(
      triggers[0]!.compareDocumentPosition(getInput()) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('shows the placeholder until a time is selected', () => {
    render(<TimePicker placeholder="Pick a time" />);

    expect(getInput()).toHaveAttribute('placeholder', 'Pick a time');
  });

  it('accepts typed input on Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker onChange={onChange} />);
    await user.type(getInput(), '1430{Enter}');

    expect(onChange).toHaveBeenCalledWith('14:30');
    expect(getInput()).toHaveValue('14:30');
  });

  it('steps with the arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker defaultValue="09:30" minuteStep={15} onChange={onChange} />);
    await user.click(getInput());
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith('09:45');

    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('09:30');
  });

  it('wraps around midnight', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker defaultValue="23:45" minuteStep={15} onChange={onChange} />);
    await user.click(getInput());
    await user.keyboard('{ArrowUp}');

    expect(onChange).toHaveBeenLastCalledWith('00:00');
  });

  it('clamps typed input to the allowed range', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TimePicker minTime="09:00" maxTime="17:00" onChange={onChange} />,
    );
    await user.type(getInput(), '2030{Enter}');

    expect(onChange).toHaveBeenCalledWith('17:00');
  });

  it('opens a panel with hour and minute columns', async () => {
    const user = userEvent.setup();

    render(<TimePicker defaultValue="09:30" />);
    await openPanel(user);

    expect(screen.getByRole('listbox', { name: 'Hours' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: 'Minutes' })).toBeInTheDocument();
    expect(screen.queryByRole('listbox', { name: 'Seconds' })).not.toBeInTheDocument();
  });

  it('selects an hour from the column', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker defaultValue="09:30" onChange={onChange} />);
    await openPanel(user);

    const hours = screen.getByRole('listbox', { name: 'Hours' });
    await user.click(within(hours).getByRole('option', { name: '14' }));

    expect(onChange).toHaveBeenCalledWith('14:30');
  });

  it('marks the selected options', async () => {
    const user = userEvent.setup();

    render(<TimePicker defaultValue="09:30" />);
    await openPanel(user);

    expect(
      within(screen.getByRole('listbox', { name: 'Hours' })).getByRole('option', {
        name: '09',
      }),
    ).toHaveAttribute('aria-selected', 'true');
    expect(
      within(screen.getByRole('listbox', { name: 'Minutes' })).getByRole('option', {
        name: '30',
      }),
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('records seconds when showSeconds is set', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker defaultValue="09:30:15" showSeconds onChange={onChange} />);

    expect(getInput()).toHaveValue('09:30:15');
    await openPanel(user);
    expect(screen.getByRole('listbox', { name: 'Seconds' })).toBeInTheDocument();
  });

  it('clears the value from the inline action', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker defaultValue="09:30" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(onChange).toHaveBeenCalledWith(null);
    expect(getInput()).toHaveValue('');
  });

  it('disables both the input and the trigger', () => {
    render(<TimePicker defaultValue="09:30" disabled />);

    expect(getInput()).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Open time picker' })).toBeDisabled();
  });

  it('moves between columns with the arrow keys', async () => {
    const user = userEvent.setup();

    render(<TimePicker defaultValue="09:30" />);
    await openPanel(user);

    const hours = screen.getByRole('listbox', { name: 'Hours' });
    within(hours).getByRole('option', { name: '09' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(
      within(screen.getByRole('listbox', { name: 'Minutes' })).getByRole('option', {
        name: '30',
      }),
    ).toHaveFocus();
  });

  it('forwards class names and refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(<TimePicker ref={ref} className="custom" />);

    expect(ref.current).toHaveClass('custom');
  });

  it('submits through the named input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker name="startsAt" onChange={onChange} />);
    await user.type(getInput(), '930{Enter}');

    await waitFor(() => {
      expect(getInput()).toHaveAttribute('name', 'startsAt');
    });
    expect(onChange).toHaveBeenCalledWith('09:30');
  });
});

describe('TimePickerColumn', () => {
  it('renders options with the selected one tabbable', () => {
    render(
      <TimePickerColumn
        label="Hours"
        value={3}
        options={[
          { value: 1, label: '01' },
          { value: 3, label: '03' },
        ]}
        onValueChange={() => {}}
      />,
    );

    expect(screen.getByRole('option', { name: '03' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('option', { name: '01' })).toHaveAttribute('tabindex', '-1');
  });
});
