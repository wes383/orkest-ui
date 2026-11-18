import { describe, expect, it } from 'vitest';

import {
  addDays,
  addMonths,
  buildCalendarWeeks,
  clampDate,
  compareDates,
  daysInMonth,
  formatISODate,
  formatMonthLabel,
  fromDayNumber,
  isSameDate,
  isWithinRange,
  parseISODate,
  resolveWeekStartsOn,
  toDayNumber,
  weekdayOf,
} from './date-utils';

describe('parseISODate', () => {
  it('parses a valid date', () => {
    expect(parseISODate('2026-11-18')).toEqual({ year: 2026, month: 10, day: 18 });
  });

  it('rejects impossible dates', () => {
    expect(parseISODate('2026-02-30')).toBeNull();
    expect(parseISODate('2023-02-29')).toBeNull();
    expect(parseISODate('2026-13-01')).toBeNull();
    expect(parseISODate('2026-00-10')).toBeNull();
  });

  it('accepts leap days', () => {
    expect(parseISODate('2024-02-29')).toEqual({ year: 2024, month: 1, day: 29 });
  });

  it('rejects other shapes', () => {
    expect(parseISODate('18/11/2026')).toBeNull();
    expect(parseISODate('2026-11')).toBeNull();
    expect(parseISODate('')).toBeNull();
    expect(parseISODate(null)).toBeNull();
  });
});

describe('formatISODate', () => {
  it('zero-pads month and day', () => {
    expect(formatISODate({ year: 2026, month: 0, day: 5 })).toBe('2026-01-05');
  });
});

describe('date arithmetic', () => {
  it('round-trips day numbers', () => {
    const date = { year: 2026, month: 10, day: 18 };

    expect(fromDayNumber(toDayNumber(date))).toEqual(date);
    expect(toDayNumber({ year: 1970, month: 0, day: 1 })).toBe(0);
  });

  it('adds days across month and year boundaries', () => {
    expect(addDays({ year: 2026, month: 11, day: 31 }, 1)).toEqual({
      year: 2027,
      month: 0,
      day: 1,
    });
    expect(addDays({ year: 2024, month: 1, day: 28 }, 1)).toEqual({
      year: 2024,
      month: 1,
      day: 29,
    });
  });

  it('clamps the day when adding months', () => {
    expect(addMonths({ year: 2026, month: 0, day: 31 }, 1)).toEqual({
      year: 2026,
      month: 1,
      day: 28,
    });
    expect(addMonths({ year: 2026, month: 0, day: 15 }, -1)).toEqual({
      year: 2025,
      month: 11,
      day: 15,
    });
  });

  it('counts month lengths', () => {
    expect(daysInMonth(2026, 1)).toBe(28);
    expect(daysInMonth(2024, 1)).toBe(29);
    expect(daysInMonth(2026, 10)).toBe(30);
  });

  it('resolves weekdays', () => {
    expect(weekdayOf({ year: 2026, month: 10, day: 18 })).toBe(3);
    expect(weekdayOf({ year: 2026, month: 10, day: 15 })).toBe(0);
  });

  it('compares and clamps', () => {
    const a = { year: 2026, month: 10, day: 10 };
    const b = { year: 2026, month: 10, day: 11 };

    expect(compareDates(a, b)).toBeLessThan(0);
    expect(compareDates(b, a)).toBeGreaterThan(0);
    expect(compareDates(a, a)).toBe(0);
    expect(isSameDate(a, { year: 2026, month: 10, day: 10 })).toBe(true);
    expect(clampDate(a, b, null)).toEqual(b);
    expect(isWithinRange(a, null, b)).toBe(true);
  });
});

describe('buildCalendarWeeks', () => {
  it('starts on the requested weekday and covers six weeks', () => {
    const weeks = buildCalendarWeeks({ year: 2026, month: 10, day: 1 }, 0);

    expect(weeks).toHaveLength(6);
    expect(weeks[0]).toHaveLength(7);
    // November 1, 2026 is a Sunday, so a Sunday-first grid starts on the 1st.
    const firstDay = weeks[0]?.[0];
    expect(firstDay && formatISODate(firstDay)).toBe('2026-11-01');
  });

  it('backfills the leading week when the month starts mid-week', () => {
    const weeks = buildCalendarWeeks({ year: 2026, month: 10, day: 1 }, 1);

    // With Monday first, November 1 needs the preceding week to start on Oct 26.
    const firstDay = weeks[0]?.[0];
    expect(firstDay && formatISODate(firstDay)).toBe('2026-10-26');
  });
});

describe('locale helpers', () => {
  it('formats a month caption', () => {
    expect(formatMonthLabel({ year: 2026, month: 10, day: 1 }, 'en-US')).toBe(
      'November 2026',
    );
  });

  it('derives the first day of the week from the locale', () => {
    expect(resolveWeekStartsOn('en-US')).toBe(0);
    expect(resolveWeekStartsOn('zh-CN')).toBe(1);
    expect(resolveWeekStartsOn('not a locale')).toBe(0);
  });
});
