/**
 * Time-of-day helpers. A time value is stored as `HH:mm` (or `HH:mm:ss` when
 * seconds are shown), always in 24-hour form, so it can be sent to an API or a
 * database without a date or timezone attached to it.
 */

export interface TimeParts {
  hours: number;
  minutes: number;
  seconds: number;
}

/** Display format only; the stored value is always 24-hour. */
export type TimeFormat = '12h' | '24h';

/** Half of a 12-hour day. */
export type DayPeriod = 'am' | 'pm';

const MINUTES_PER_DAY = 24 * 60;
const TIME_VALUE_PATTERN = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
const DAY_PERIOD_PREFIX = /^(上午|下午|凌晨|早上|晚上|中午)/;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function isValidTimeParts(parts: TimeParts): boolean {
  const { hours, minutes, seconds } = parts;

  return (
    Number.isInteger(hours) &&
    Number.isInteger(minutes) &&
    Number.isInteger(seconds) &&
    hours >= 0 &&
    hours < 24 &&
    minutes >= 0 &&
    minutes < 60 &&
    seconds >= 0 &&
    seconds < 60
  );
}

/** Parses a stored `HH:mm` or `HH:mm:ss` value. */
export function parseTimeValue(value: string | null | undefined): TimeParts | null {
  if (!value) {
    return null;
  }

  const match = TIME_VALUE_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const parts = {
    hours: Number(match[1]),
    minutes: Number(match[2]),
    seconds: Number(match[3] ?? 0),
  };

  return isValidTimeParts(parts) ? parts : null;
}

export function toTimeValue(parts: TimeParts, options: { showSeconds?: boolean } = {}): string {
  const time = `${pad2(parts.hours)}:${pad2(parts.minutes)}`;

  return options.showSeconds ? `${time}:${pad2(parts.seconds)}` : time;
}

export function toMinutes(parts: TimeParts): number {
  return parts.hours * 60 + parts.minutes;
}

export function fromMinutes(total: number): TimeParts {
  const normalized = ((total % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;

  return {
    hours: Math.floor(normalized / 60),
    minutes: normalized % 60,
    seconds: 0,
  };
}

/** Locale-aware display text, e.g. `9:30 AM` or `上午9:30`. */
export function formatTimeLabel(
  parts: TimeParts,
  options: { format?: TimeFormat; showSeconds?: boolean; locale?: string },
): string {
  const { format = '24h', showSeconds = false, locale = 'en-US' } = options;

  if (format === '24h') {
    const time = `${pad2(parts.hours)}:${pad2(parts.minutes)}`;

    return showSeconds ? `${time}:${pad2(parts.seconds)}` : time;
  }

  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    ...(showSeconds ? { second: '2-digit' } : {}),
    hour12: true,
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(2000, 0, 1, parts.hours, parts.minutes, parts.seconds)));
}

/** Hour label used inside the column: `00` in 24-hour mode, `12 AM` in 12-hour mode. */
export function formatHourLabel(
  hours: number,
  format: TimeFormat,
  locale: string = 'en-US',
): string {
  if (format === '24h') {
    return pad2(hours);
  }

  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(2000, 0, 1, hours)));
}

export function formatMinuteLabel(minutes: number): string {
  return pad2(minutes);
}

/** Day period of a 24-hour value. Treats an unknown hour as the morning. */
export function getDayPeriod(hours: number | null | undefined): DayPeriod {
  return (hours ?? 0) >= 12 ? 'pm' : 'am';
}

/** Converts a 24-hour value to the 1-12 clock face. */
export function to12Hour(hours: number): number {
  const normalized = ((hours % 12) + 12) % 12;

  return normalized === 0 ? 12 : normalized;
}

/** Converts a 1-12 clock face back to a 24-hour value. */
export function from12Hour(hours: number, period: DayPeriod): number {
  return (hours % 12) + (period === 'pm' ? 12 : 0);
}

/** Localized day period, e.g. `AM`, `PM`, or `上午`. */
export function formatDayPeriod(hours: number, locale: string = 'en-US'): string {
  const part = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  })
    .formatToParts(new Date(Date.UTC(2000, 0, 1, hours)))
    .find(({ type }) => type === 'dayPeriod');

  return part?.value ?? (getDayPeriod(hours) === 'am' ? 'AM' : 'PM');
}

/**
 * Parses free-form typed input. Accepts `9`, `930`, `1430`, `09:30`, `9:30:15`,
 * and `1:45 PM`, plus the localized day-period prefixes used by 12-hour display.
 */
export function parseTimeInput(
  text: string,
  options: { format?: TimeFormat } = {},
): TimeParts | null {
  const { format = '24h' } = options;
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  let rest = trimmed.replace(/\s+/g, '').toUpperCase();
  let period: 'am' | 'pm' | null = null;
  const prefix = DAY_PERIOD_PREFIX.exec(rest);

  if (prefix) {
    const prefixText = prefix[1] ?? '';
    period = prefixText === '下午' || prefixText === '晚上' ? 'pm' : 'am';
    rest = rest.slice(prefixText.length);
  } else if (/(AM|PM)$/.test(rest)) {
    period = rest.endsWith('PM') ? 'pm' : 'am';
    rest = rest.slice(0, -2);
  }

  rest = rest.replace(/\./g, '');

  const segments = rest.split(':');
  let hourText: string;
  let minuteText = '0';
  let secondText = '0';

  if (segments.length > 1) {
    if (segments.length > 3 || segments.some((segment) => !/^\d{1,2}$/.test(segment))) {
      return null;
    }

    hourText = segments[0] ?? '';
    minuteText = segments[1] ?? '0';
    secondText = segments[2] ?? '0';
  } else {
    if (!/^\d{1,6}$/.test(rest)) {
      return null;
    }

    switch (rest.length) {
      case 1:
      case 2:
        hourText = rest;
        break;
      case 3:
        hourText = rest.slice(0, 1);
        minuteText = rest.slice(1);
        break;
      case 4:
        hourText = rest.slice(0, 2);
        minuteText = rest.slice(2);
        break;
      case 5:
        hourText = rest.slice(0, 1);
        minuteText = rest.slice(1, 3);
        secondText = rest.slice(3);
        break;
      default:
        hourText = rest.slice(0, 2);
        minuteText = rest.slice(2, 4);
        secondText = rest.slice(4);
    }
  }

  let hours = Number(hourText);
  const minutes = Number(minuteText);
  const seconds = Number(secondText);

  if (period) {
    if (hours < 1 || hours > 12) {
      return null;
    }

    hours = (hours % 12) + (period === 'pm' ? 12 : 0);
  } else if (format === '12h' && hours === 0) {
    return null;
  }

  const parts = { hours, minutes, seconds };

  return isValidTimeParts(parts) ? parts : null;
}

/** Rounds minutes to the nearest step so a typed value stays selectable in the columns. */
export function snapToStep(parts: TimeParts, minuteStep: number): TimeParts {
  const step = Math.max(1, Math.floor(minuteStep));

  if (step === 1) {
    return parts;
  }

  const rounded = Math.round(parts.minutes / step) * step;

  if (rounded >= 60) {
    return { hours: (parts.hours + 1) % 24, minutes: 0, seconds: parts.seconds };
  }

  return { ...parts, minutes: rounded };
}

export function compareTime(a: TimeParts, b: TimeParts): number {
  return (
    a.hours * 3600 + a.minutes * 60 + a.seconds - (b.hours * 3600 + b.minutes * 60 + b.seconds)
  );
}

export function isWithinTimeRange(
  parts: TimeParts,
  min?: TimeParts | null,
  max?: TimeParts | null,
): boolean {
  if (min && compareTime(parts, min) < 0) {
    return false;
  }

  if (max && compareTime(parts, max) > 0) {
    return false;
  }

  return true;
}

export function clampTime(
  parts: TimeParts,
  min?: TimeParts | null,
  max?: TimeParts | null,
): TimeParts {
  if (min && compareTime(parts, min) < 0) {
    return min;
  }

  if (max && compareTime(parts, max) > 0) {
    return max;
  }

  return parts;
}

/**
 * Moves by one step in the given direction. An unaligned value is aligned
 * first, so a single key press always changes the time.
 */
export function stepTime(
  parts: TimeParts,
  direction: 1 | -1,
  options: { minuteStep?: number; min?: TimeParts | null; max?: TimeParts | null } = {},
): TimeParts {
  const { minuteStep = 1, min, max } = options;
  const step = Math.max(1, Math.floor(minuteStep));
  const total = parts.hours * 60 + parts.minutes;
  const base = direction > 0 ? Math.floor(total / step) * step : Math.ceil(total / step) * step;
  const next = fromMinutes(base + direction * step);

  return clampTime({ ...next, seconds: parts.seconds }, min, max);
}

/** Hour options for a column, ordered 0-23. */
export function buildHourOptions(
  format: TimeFormat,
  locale: string = 'en-US',
): Array<{ value: number; label: string }> {
  return Array.from({ length: 24 }, (_, hours) => ({
    value: hours,
    label: formatHourLabel(hours, format, locale),
  }));
}

export function buildMinuteOptions(minuteStep: number): Array<{ value: number; label: string }> {
  const step = Math.max(1, Math.floor(minuteStep));
  const options: Array<{ value: number; label: string }> = [];

  for (let minutes = 0; minutes < 60; minutes += step) {
    options.push({ value: minutes, label: formatMinuteLabel(minutes) });
  }

  return options;
}

export function buildSecondOptions(): Array<{ value: number; label: string }> {
  return Array.from({ length: 60 }, (_, seconds) => ({
    value: seconds,
    label: pad2(seconds),
  }));
}
