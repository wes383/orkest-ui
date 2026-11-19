import { createRef } from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DateRangePicker } from './date-range-picker';

const PLACEHOLDER = 'Start date – End date';

async function open(user: ReturnType<typeof userEvent.setup>, name = PLACEHOLDER) {
  await user.click(screen.getByRole('button', { name }));
  return screen.findByRole('dialog', { name: 'Choose a date range' });
}

function day(gridName: string, label: RegExp) {
  return within(screen.getByRole('grid', { name: gridName })).getByRole('gridcell', {
    name: label,
  });
}

describe('DateRangePicker', () => {
  it('shows the placeholder until a range is picked', () => {
    render(<DateRangePicker />);

    expect(screen.getByRole('button', { name: PLACEHOLDER })).toBeInTheDocument();
  });

  it('formats both ends with the default medium style', () => {
    render(<DateRangePicker defaultValue={{ start: '2026-11-18', end: '2026-11-22' }} />);

    expect(screen.getByRole('button', { name: 'Nov 18, 2026 – Nov 22, 2026' })).toBeInTheDocument();
  });

  it('opens two consecutive months', async () => {
    const user = userEvent.setup();

    render(<DateRangePicker defaultValue={{ start: '2026-11-18', end: '2026-11-22' }} />);
    await open(user, 'Nov 18, 2026 – Nov 22, 2026');

    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
  });

  it('picks a start, then commits the range on the second click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangePicker
        defaultValue={{ start: '2026-11-10', end: '2026-11-12' }}
        onChange={onChange}
      />,
    );
    await open(user, 'Nov 10, 2026 – Nov 12, 2026');

    await user.click(day('November 2026', /November 18, 2026/));

    expect(onChange).not.toHaveBeenCalled();
    expect(day('November 2026', /November 18, 2026/)).toHaveAttribute('data-range-start', 'true');

    await user.click(day('November 2026', /November 22, 2026/));

    expect(onChange).toHaveBeenCalledWith({ start: '2026-11-18', end: '2026-11-22' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('swaps the ends when the second click lands earlier', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangePicker
        defaultValue={{ start: '2026-11-10', end: '2026-11-12' }}
        onChange={onChange}
      />,
    );
    await open(user, 'Nov 10, 2026 – Nov 12, 2026');

    await user.click(day('November 2026', /November 22, 2026/));
    await user.click(day('November 2026', /November 18, 2026/));

    expect(onChange).toHaveBeenCalledWith({ start: '2026-11-18', end: '2026-11-22' });
  });

  it('previews the span while the pointer moves', async () => {
    const user = userEvent.setup();

    render(<DateRangePicker defaultValue={{ start: '2026-11-10', end: '2026-11-12' }} />);
    await open(user, 'Nov 10, 2026 – Nov 12, 2026');

    await user.click(day('November 2026', /November 18, 2026/));
    await user.hover(day('November 2026', /November 22, 2026/));

    expect(day('November 2026', /November 20, 2026/)).toHaveAttribute('data-in-range', 'true');
    expect(day('November 2026', /November 22, 2026/)).toHaveAttribute('data-range-preview', 'true');
  });

  it('clears both ends', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangePicker
        defaultValue={{ start: '2026-11-18', end: '2026-11-22' }}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Clear range' }));

    expect(onChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole('button', { name: PLACEHOLDER })).toBeInTheDocument();
  });

  it('renders one month when asked', async () => {
    const user = userEvent.setup();

    render(
      <DateRangePicker months={1} defaultValue={{ start: '2026-11-10', end: '2026-11-12' }} />,
    );
    await open(user, 'Nov 10, 2026 – Nov 12, 2026');

    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
    expect(screen.queryByRole('grid', { name: 'December 2026' })).not.toBeInTheDocument();
  });

  it('blocks dates outside the range', async () => {
    const user = userEvent.setup();

    render(
      <DateRangePicker
        defaultValue={{ start: '2026-11-10', end: '2026-11-12' }}
        minDate="2026-11-05"
        maxDate="2026-11-20"
      />,
    );
    await open(user, 'Nov 10, 2026 – Nov 12, 2026');

    expect(day('November 2026', /November 4, 2026/)).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getAllByRole('button', { name: 'Previous month' })[0]).toBeDisabled();
  });

  it('submits both ends through hidden inputs', () => {
    const { container } = render(
      <DateRangePicker defaultValue={{ start: '2026-11-18', end: '2026-11-22' }} name="stay" />,
    );

    expect(container.querySelector('input[name="stay-start"]')).toHaveValue('2026-11-18');
    expect(container.querySelector('input[name="stay-end"]')).toHaveValue('2026-11-22');
  });

  it('forwards class names and refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(<DateRangePicker ref={ref} className="custom" id="stay" />);

    expect(ref.current).toHaveClass('custom');
    expect(screen.getByRole('button', { name: PLACEHOLDER })).toHaveAttribute('id', 'stay');
  });
});
