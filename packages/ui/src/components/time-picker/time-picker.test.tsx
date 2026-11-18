import { createRef } from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TimePicker, TimePickerColumn } from './time-picker';

function getSegment(name: 'Hours' | 'Minutes' | 'Seconds' | 'AM/PM') {
  return screen.getByRole('spinbutton', { name });
}

async function openPanel(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Open time picker' }));
  return screen.findByRole('dialog', { name: 'Choose a time' });
}

describe('TimePicker', () => {
  it('renders the stored value one segment per unit', () => {
    render(<TimePicker defaultValue="09:30" />);

    expect(getSegment('Hours')).toHaveTextContent('09');
    expect(getSegment('Minutes')).toHaveTextContent('30');
    expect(screen.queryByRole('spinbutton', { name: 'Seconds' })).not.toBeInTheDocument();
  });

  it('renders a 12-hour display with a day-period segment', () => {
    const onChange = vi.fn();

    render(<TimePicker defaultValue="13:45" format="12h" onChange={onChange} />);

    expect(getSegment('Hours')).toHaveTextContent('01');
    expect(getSegment('Minutes')).toHaveTextContent('45');
    expect(getSegment('AM/PM')).toHaveTextContent('PM');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('selects the digits when a segment is reached with the keyboard', async () => {
    const user = userEvent.setup();

    render(<TimePicker defaultValue="09:30" showIcon={false} />);
    await user.tab();

    expect(getSegment('Hours')).toHaveFocus();
    expect(window.getSelection()?.toString()).toBe('09');
  });

  it('keeps the typed digits selected and moves the selection on', async () => {
    const user = userEvent.setup();

    render(<TimePicker defaultValue="09:30" />);
    await user.click(getSegment('Hours'));
    await user.keyboard('1');

    expect(getSegment('Hours')).toHaveTextContent('01');
    expect(window.getSelection()?.toString()).toBe('01');

    await user.keyboard('4');

    expect(getSegment('Hours')).toHaveTextContent('14');
    expect(getSegment('Minutes')).toHaveFocus();
    expect(window.getSelection()?.toString()).toBe('30');
  });

  it('selects the digits on pointer down', () => {
    render(<TimePicker defaultValue="09:30" />);

    fireEvent.mouseDown(getSegment('Minutes'));

    expect(getSegment('Minutes')).toHaveFocus();
    expect(window.getSelection()?.toString()).toBe('30');
  });

  it('opens the panel from a single clock action on the leading side', () => {
    render(<TimePicker defaultValue="09:30" />);

    const triggers = screen.getAllByRole('button', { name: 'Open time picker' });

    expect(triggers).toHaveLength(1);
    expect(
      triggers[0]!.compareDocumentPosition(screen.getByRole('group')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('hides the clock action when showIcon is false', () => {
    render(<TimePicker defaultValue="09:30" showIcon={false} />);

    expect(screen.queryByRole('button', { name: 'Open time picker' })).not.toBeInTheDocument();
    expect(getSegment('Hours')).toHaveTextContent('09');
  });

  it('shows the placeholder until a time is selected', () => {
    render(<TimePicker placeholder="Pick a time" />);

    expect(screen.getByText('Pick a time')).toBeInTheDocument();
  });

  it('fills the segments from typed digits', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker onChange={onChange} />);
    await user.click(getSegment('Hours'));
    await user.keyboard('1430');

    expect(onChange).toHaveBeenCalledWith('14:30');
    expect(getSegment('Hours')).toHaveTextContent('14');
    expect(getSegment('Minutes')).toHaveTextContent('30');
  });

  it('steps the focused segment with the arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker defaultValue="09:30" minuteStep={15} onChange={onChange} />);
    await user.click(getSegment('Minutes'));
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith('09:45');

    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('09:30');
  });

  it('wraps the hour segment around midnight', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker defaultValue="23:45" minuteStep={15} onChange={onChange} />);
    await user.click(getSegment('Hours'));
    await user.keyboard('{ArrowUp}');

    expect(onChange).toHaveBeenLastCalledWith('00:45');
  });

  it('clamps typed input to the allowed range', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker minTime="09:00" maxTime="17:00" onChange={onChange} />);
    await user.click(getSegment('Hours'));
    await user.keyboard('2030');

    expect(onChange).toHaveBeenCalledWith('17:00');
    expect(getSegment('Hours')).toHaveTextContent('17');
  });

  it('moves between segments with the arrow keys', async () => {
    const user = userEvent.setup();

    render(<TimePicker defaultValue="09:30" />);
    await user.click(getSegment('Hours'));
    await user.keyboard('{ArrowRight}');

    expect(getSegment('Minutes')).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(getSegment('Hours')).toHaveFocus();
  });

  it('clears one segment without committing an incomplete time', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker defaultValue="09:30" onChange={onChange} />);
    await user.click(getSegment('Hours'));
    await user.keyboard('{Backspace}');

    expect(getSegment('Hours')).toHaveTextContent('hh');
    expect(getSegment('Hours')).not.toHaveAttribute('aria-valuenow');
    expect(onChange).not.toHaveBeenCalled();

    await user.keyboard('8');
    expect(onChange).toHaveBeenLastCalledWith('08:30');
  });

  it('switches the day period from the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker defaultValue="13:45" format="12h" onChange={onChange} />);
    await user.click(getSegment('AM/PM'));
    await user.keyboard('a');

    expect(onChange).toHaveBeenLastCalledWith('01:45');
    expect(getSegment('AM/PM')).toHaveTextContent('AM');
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

  it('adds a seconds segment when showSeconds is set', async () => {
    const user = userEvent.setup();

    render(<TimePicker defaultValue="09:30:15" showSeconds />);

    expect(getSegment('Seconds')).toHaveTextContent('15');
    await openPanel(user);
    expect(screen.getByRole('listbox', { name: 'Seconds' })).toBeInTheDocument();
  });

  it('clears the value from the inline action', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker defaultValue="09:30" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(onChange).toHaveBeenCalledWith(null);
    expect(getSegment('Hours')).toHaveTextContent('hh');
    // Clearing returns the focus to the field, so the placeholder gives way to
    // the empty segments.
    expect(getSegment('Hours')).toHaveFocus();
  });

  it('disables the segments and the trigger', () => {
    render(<TimePicker defaultValue="09:30" disabled />);

    expect(getSegment('Hours')).toHaveAttribute('aria-disabled', 'true');
    expect(getSegment('Hours')).toHaveAttribute('tabindex', '-1');
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

    render(<TimePicker name="startsAt" />);
    await user.click(getSegment('Hours'));
    await user.keyboard('0930');

    expect(document.querySelector('input[name="startsAt"]')).toHaveValue('09:30');
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
