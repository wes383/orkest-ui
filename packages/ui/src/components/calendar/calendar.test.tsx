import { createRef } from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Calendar, CalendarDay, CalendarGrid, CalendarHeader } from './calendar';

const NOVEMBER = '2026-11';

function day(name: string) {
  return screen.getByRole('gridcell', { name: new RegExp(name) });
}

describe('Calendar', () => {
  it('renders the month caption and a full six-week grid', () => {
    render(<Calendar defaultMonth={NOVEMBER} />);

    expect(screen.getByText('November 2026')).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(7);
    expect(screen.getAllByRole('gridcell')).toHaveLength(42);
  });

  it('selects a day and reports it as an ISO string', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Calendar defaultMonth={NOVEMBER} onChange={onChange} />);
    await user.click(day('November 18, 2026'));

    expect(onChange).toHaveBeenCalledWith('2026-11-18');
  });

  it('marks the selected day', () => {
    render(<Calendar defaultMonth={NOVEMBER} defaultValue="2026-11-18" />);

    expect(day('November 18, 2026')).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps the value controlled when `value` is provided', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Calendar month={NOVEMBER} value="2026-11-18" onChange={onChange} />);
    await user.click(day('November 20, 2026'));

    expect(onChange).toHaveBeenCalledWith('2026-11-20');
    expect(day('November 18, 2026')).toHaveAttribute('aria-selected', 'true');
  });

  it('blocks dates outside the range and marked dates', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Calendar
        defaultMonth={NOVEMBER}
        minDate="2026-11-10"
        maxDate="2026-11-20"
        disabledDates={['2026-11-12']}
        onChange={onChange}
      />,
    );

    expect(day('November 9, 2026')).toHaveAttribute('aria-disabled', 'true');
    expect(day('November 21, 2026')).toHaveAttribute('aria-disabled', 'true');
    expect(day('November 12, 2026')).toHaveAttribute('aria-disabled', 'true');

    await user.click(day('November 12, 2026'));
    expect(onChange).not.toHaveBeenCalled();

    await user.click(day('November 13, 2026'));
    expect(onChange).toHaveBeenCalledWith('2026-11-13');
  });

  it('accepts a predicate for disabled dates', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Calendar
        defaultMonth={NOVEMBER}
        disabledDates={(value) => value.endsWith('-15')}
        onChange={onChange}
      />,
    );

    await user.click(day('November 15, 2026'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('moves the visible month with the header buttons', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();

    render(<Calendar defaultMonth={NOVEMBER} onMonthChange={onMonthChange} />);
    await user.click(screen.getByRole('button', { name: 'Next month' }));

    expect(onMonthChange).toHaveBeenCalledWith('2026-12');
    expect(screen.getByText('December 2026')).toBeInTheDocument();
  });

  it('switches months and years with the caption selects', async () => {
    const user = userEvent.setup();

    render(<Calendar defaultMonth={NOVEMBER} captionLayout="select" />);

    const monthSelect = screen.getByRole('combobox', { name: 'Month' });
    const yearSelect = screen.getByRole('combobox', { name: 'Year' });

    expect(monthSelect).toHaveTextContent('November');
    expect(yearSelect).toHaveTextContent('2026');

    await user.click(monthSelect);
    await user.click(await screen.findByRole('option', { name: 'December' }));

    expect(monthSelect).toHaveTextContent('December');
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();

    await user.click(yearSelect);
    await user.click(await screen.findByRole('option', { name: '2027' }));

    expect(yearSelect).toHaveTextContent('2027');
    expect(screen.getByRole('grid', { name: 'December 2027' })).toBeInTheDocument();
  });

  it('navigates with arrow keys and keeps one tab stop', async () => {
    const user = userEvent.setup();

    render(<Calendar defaultMonth={NOVEMBER} defaultValue="2026-11-10" />);
    const start = day('November 10, 2026');

    expect(start).toHaveAttribute('tabindex', '0');
    start.focus();

    await user.keyboard('{ArrowRight}');
    expect(day('November 11, 2026')).toHaveFocus();
    expect(day('November 11, 2026')).toHaveAttribute('tabindex', '0');
    expect(day('November 10, 2026')).toHaveAttribute('tabindex', '-1');

    await user.keyboard('{ArrowDown}');
    expect(day('November 18, 2026')).toHaveFocus();

    await user.keyboard('{Home}');
    expect(day('November 15, 2026')).toHaveFocus();

    await user.keyboard('{End}');
    expect(day('November 21, 2026')).toHaveFocus();
  });

  it('pages between months with PageUp and PageDown', async () => {
    const user = userEvent.setup();

    render(<Calendar defaultMonth={NOVEMBER} defaultValue="2026-11-10" />);
    day('November 10, 2026').focus();

    await user.keyboard('{PageDown}');
    expect(screen.getByText('December 2026')).toBeInTheDocument();
    expect(day('December 10, 2026')).toHaveFocus();

    await user.keyboard('{PageUp}');
    expect(screen.getByText('November 2026')).toBeInTheDocument();
  });

  it('hides adjacent-month days when asked', () => {
    render(<Calendar defaultMonth={NOVEMBER} showOutsideDays={false} />);

    expect(screen.getAllByRole('gridcell')).toHaveLength(42);
    expect(
      screen.queryByRole('gridcell', { name: /October 31, 2026/ }),
    ).not.toBeInTheDocument();
  });

  it('forwards class names and refs, and composes from parts', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Calendar ref={ref} defaultMonth={NOVEMBER} className="custom" data-testid="cal">
        <CalendarHeader data-testid="header" />
        <CalendarGrid data-testid="grid" />
      </Calendar>,
    );

    expect(ref.current).toHaveClass('custom');
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(within(screen.getByTestId('grid')).getAllByRole('gridcell')).toHaveLength(42);
  });

  it('throws when a part is used outside the calendar', () => {
    expect(() => render(<CalendarDay date="2026-11-18" />)).toThrow(
      /outside|inside <Calendar>/i,
    );
  });

  it('disables every day when the calendar is disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Calendar defaultMonth={NOVEMBER} disabled onChange={onChange} />);
    await user.click(day('November 18, 2026'));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
  });
});
