import { describe, expect, it } from 'vitest';

import {
  buildHourOptions,
  buildMinuteOptions,
  buildSecondOptions,
  clampTime,
  formatHourLabel,
  formatTimeLabel,
  isWithinTimeRange,
  parseTimeInput,
  parseTimeValue,
  snapToStep,
  stepTime,
  toTimeValue,
} from './time-utils';

describe('parseTimeValue', () => {
  it('parses the stored 24-hour format', () => {
    expect(parseTimeValue('09:30')).toEqual({ hours: 9, minutes: 30, seconds: 0 });
    expect(parseTimeValue('23:59:45')).toEqual({ hours: 23, minutes: 59, seconds: 45 });
  });

  it('rejects anything else', () => {
    expect(parseTimeValue('9:30')).toBeNull();
    expect(parseTimeValue('24:00')).toBeNull();
    expect(parseTimeValue('12:60')).toBeNull();
    expect(parseTimeValue('')).toBeNull();
    expect(parseTimeValue(null)).toBeNull();
  });
});

describe('toTimeValue', () => {
  it('always writes 24-hour, zero-padded text', () => {
    expect(toTimeValue({ hours: 9, minutes: 5, seconds: 0 })).toBe('09:05');
    expect(toTimeValue({ hours: 13, minutes: 45, seconds: 30 })).toBe('13:45');
    expect(toTimeValue({ hours: 13, minutes: 45, seconds: 30 }, { showSeconds: true })).toBe(
      '13:45:30',
    );
  });
});

describe('parseTimeInput', () => {
  it('accepts typed 24-hour forms', () => {
    expect(parseTimeInput('9')).toEqual({ hours: 9, minutes: 0, seconds: 0 });
    expect(parseTimeInput('930')).toEqual({ hours: 9, minutes: 30, seconds: 0 });
    expect(parseTimeInput('1430')).toEqual({ hours: 14, minutes: 30, seconds: 0 });
    expect(parseTimeInput('14:30')).toEqual({ hours: 14, minutes: 30, seconds: 0 });
    expect(parseTimeInput('9:05:07')).toEqual({ hours: 9, minutes: 5, seconds: 7 });
  });

  it('accepts a day period in either language', () => {
    expect(parseTimeInput('1:45 PM')).toEqual({ hours: 13, minutes: 45, seconds: 0 });
    expect(parseTimeInput('12 AM')).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    expect(parseTimeInput('12 PM')).toEqual({ hours: 12, minutes: 0, seconds: 0 });
    expect(parseTimeInput('下午3:20')).toEqual({ hours: 15, minutes: 20, seconds: 0 });
  });

  it('rejects out-of-range and malformed input', () => {
    expect(parseTimeInput('25:00')).toBeNull();
    expect(parseTimeInput('12:70')).toBeNull();
    expect(parseTimeInput('abc')).toBeNull();
    expect(parseTimeInput('')).toBeNull();
  });
});

describe('formatTimeLabel', () => {
  it('formats 24-hour text without a day period', () => {
    expect(formatTimeLabel({ hours: 9, minutes: 5, seconds: 0 }, { format: '24h' })).toBe('09:05');
  });

  it('formats 12-hour text for the locale', () => {
    expect(formatTimeLabel({ hours: 13, minutes: 45, seconds: 0 }, { format: '12h' })).toBe(
      '1:45 PM',
    );
    expect(formatTimeLabel({ hours: 9, minutes: 30, seconds: 0 }, { format: '12h' })).toBe(
      '9:30 AM',
    );
  });

  it('inclues seconds when asked', () => {
    expect(formatTimeLabel({ hours: 9, minutes: 30, seconds: 7 }, { showSeconds: true })).toBe(
      '09:30:07',
    );
  });
});

describe('formatHourLabel', () => {
  it('uses zero-padded hours in 24-hour mode', () => {
    expect(formatHourLabel(0, '24h')).toBe('00');
    expect(formatHourLabel(13, '24h')).toBe('13');
  });

  it('uses day periods in 12-hour mode', () => {
    expect(formatHourLabel(0, '12h')).toBe('12 AM');
    expect(formatHourLabel(13, '12h')).toBe('1 PM');
  });
});

describe('stepTime', () => {
  it('moves by the minute step and wraps at midnight', () => {
    expect(stepTime({ hours: 9, minutes: 30, seconds: 0 }, 1, { minuteStep: 15 })).toEqual({
      hours: 9,
      minutes: 45,
      seconds: 0,
    });
    expect(stepTime({ hours: 23, minutes: 45, seconds: 0 }, 1, { minuteStep: 15 })).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    expect(stepTime({ hours: 0, minutes: 0, seconds: 0 }, -1, { minuteStep: 15 })).toEqual({
      hours: 23,
      minutes: 45,
      seconds: 0,
    });
  });

  it('aligns an unaligned value before stepping', () => {
    expect(stepTime({ hours: 9, minutes: 7, seconds: 0 }, 1, { minuteStep: 15 })).toEqual({
      hours: 9,
      minutes: 15,
      seconds: 0,
    });
    expect(stepTime({ hours: 9, minutes: 7, seconds: 0 }, -1, { minuteStep: 15 })).toEqual({
      hours: 9,
      minutes: 0,
      seconds: 0,
    });
  });

  it('clamps to the allowed range', () => {
    const min = { hours: 9, minutes: 0, seconds: 0 };
    const max = { hours: 17, minutes: 0, seconds: 0 };

    expect(
      stepTime({ hours: 17, minutes: 0, seconds: 0 }, 1, { minuteStep: 30, min, max }),
    ).toEqual(max);
    expect(
      stepTime({ hours: 9, minutes: 0, seconds: 0 }, -1, { minuteStep: 30, min, max }),
    ).toEqual(min);
  });
});

describe('snapToStep', () => {
  it('rounds to the nearest step and rolls over the hour', () => {
    expect(snapToStep({ hours: 9, minutes: 7, seconds: 0 }, 15)).toEqual({
      hours: 9,
      minutes: 0,
      seconds: 0,
    });
    expect(snapToStep({ hours: 9, minutes: 8, seconds: 0 }, 15)).toEqual({
      hours: 9,
      minutes: 15,
      seconds: 0,
    });
    expect(snapToStep({ hours: 9, minutes: 58, seconds: 0 }, 15)).toEqual({
      hours: 10,
      minutes: 0,
      seconds: 0,
    });
  });

  it('leaves the value alone for a one-minute step', () => {
    const parts = { hours: 9, minutes: 7, seconds: 0 };

    expect(snapToStep(parts, 1)).toBe(parts);
  });
});

describe('range helpers', () => {
  const min = { hours: 9, minutes: 0, seconds: 0 };
  const max = { hours: 17, minutes: 0, seconds: 0 };

  it('checks the inclusive window', () => {
    expect(isWithinTimeRange({ hours: 8, minutes: 59, seconds: 0 }, min, max)).toBe(false);
    expect(isWithinTimeRange({ hours: 9, minutes: 0, seconds: 0 }, min, max)).toBe(true);
    expect(isWithinTimeRange({ hours: 17, minutes: 0, seconds: 0 }, min, max)).toBe(true);
    expect(isWithinTimeRange({ hours: 17, minutes: 1, seconds: 0 }, min, max)).toBe(false);
  });

  it('clamps to the nearest bound', () => {
    expect(clampTime({ hours: 7, minutes: 30, seconds: 0 }, min, max)).toBe(min);
    expect(clampTime({ hours: 19, minutes: 30, seconds: 0 }, min, max)).toBe(max);
  });
});

describe('column options', () => {
  it('lists every hour', () => {
    expect(buildHourOptions('24h')).toHaveLength(24);
    expect(buildHourOptions('24h')[0]).toEqual({ value: 0, label: '00' });
  });

  it('lists minutes by step', () => {
    expect(buildMinuteOptions(15).map((option) => option.label)).toEqual(['00', '15', '30', '45']);
    expect(buildMinuteOptions(60)).toHaveLength(1);
  });

  it('lists every second', () => {
    expect(buildSecondOptions()).toHaveLength(60);
  });
});
