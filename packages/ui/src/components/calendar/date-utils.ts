/**
 * Calendar math for civil dates: a year, month, and day with no time and no
 * timezone. Everything here works on integers only, so a date never shifts
 * across a daylight-saving boundary or when the host timezone changes.
 */

/** A calendar date. `month` is zero-based, `day` starts at 1. */
export interface CivilDate {
  year: number;
  /** Zero-based month: 0 = January, 11 = December. */
  month: number;
  /** Day of month, starting at 1. */
  day: number;
}

/** Day of week, zero-based from Sunday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTH_LABEL_CACHE = new Map<string, Intl.DateTimeFormat>();

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  if (month === 1 && isLeapYear(year)) {
    return 29;
  }

  return DAYS_IN_MONTH[month] ?? 0;
}

export function isValidCivilDate(date: CivilDate): boolean {
  const { year, month, day } = date;

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }

  if (month < 0 || month > 11 || day < 1) {
    return false;
  }

  return day <= daysInMonth(year, month);
}

/** Parses `YYYY-MM-DD`, returning `null` for anything else, including invalid days. */
export function parseISODate(value: string | null | undefined): CivilDate | null {
  if (!value) {
    return null;
  }

  const match = ISO_DATE_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const date = {
    year: Number(match[1]),
    month: Number(match[2]) - 1,
    day: Number(match[3]),
  };

  return isValidCivilDate(date) ? date : null;
}

/** Formats as `YYYY-MM-DD`. */
export function formatISODate(date: CivilDate): string {
  const month = String(date.month + 1).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');

  return `${String(date.year).padStart(4, '0')}-${month}-${day}`;
}

/** Formats as `YYYY-MM`, used for the visible month. */
export function formatISOMonth(date: CivilDate): string {
  return `${String(date.year).padStart(4, '0')}-${String(date.month + 1).padStart(2, '0')}`;
}

export function parseISOMonth(value: string | null | undefined): CivilDate | null {
  if (!value) {
    return null;
  }

  return parseISODate(`${value}-01`);
}

/**
 * Days since 1970-01-01 for a proleptic Gregorian date. Adapted from Howard
 * Hinnant's `days_from_civil`, which is exact for the whole supported range.
 */
export function toDayNumber(date: CivilDate): number {
  const month = date.month + 1;
  const year = date.year - (month <= 2 ? 1 : 0);
  const era = Math.floor(year / 400);
  const yearOfEra = year - era * 400;
  const dayOfYear =
    Math.floor((153 * (month + (month > 2 ? -3 : 9)) + 2) / 5) + date.day - 1;
  const dayOfEra =
    yearOfEra * 365 +
    Math.floor(yearOfEra / 4) -
    Math.floor(yearOfEra / 100) +
    dayOfYear;

  return era * 146097 + dayOfEra - 719468;
}

export function fromDayNumber(dayNumber: number): CivilDate {
  const shifted = dayNumber + 719468;
  const era = Math.floor(shifted / 146097);
  const dayOfEra = shifted - era * 146097;
  const yearOfEra = Math.floor(
    (dayOfEra -
      Math.floor(dayOfEra / 1460) +
      Math.floor(dayOfEra / 36524) -
      Math.floor(dayOfEra / 146096)) /
      365,
  );
  const year = yearOfEra + era * 400;
  const dayOfYear =
    dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
  const monthPart = Math.floor((5 * dayOfYear + 2) / 153);
  const day = dayOfYear - Math.floor((153 * monthPart + 2) / 5) + 1;
  const month = monthPart + (monthPart < 10 ? 3 : -9);

  return { year: year + (month <= 2 ? 1 : 0), month: month - 1, day };
}

/** Weekday for a civil date. 0 = Sunday. 1970-01-01 was a Thursday. */
export function weekdayOf(date: CivilDate): Weekday {
  const dayNumber = toDayNumber(date);

  return (((dayNumber + 4) % 7) + 7) % 7 as Weekday;
}

export function addDays(date: CivilDate, amount: number): CivilDate {
  return fromDayNumber(toDayNumber(date) + amount);
}

/** Adds months, clamping the day to the target month's length. */
export function addMonths(date: CivilDate, amount: number): CivilDate {
  const total = date.year * 12 + date.month + amount;
  const year = Math.floor(total / 12);
  const month = total - year * 12;

  return {
    year,
    month,
    day: Math.min(date.day, daysInMonth(year, month)),
  };
}

export function startOfMonth(date: CivilDate): CivilDate {
  return { year: date.year, month: date.month, day: 1 };
}

export function compareDates(a: CivilDate, b: CivilDate): number {
  return toDayNumber(a) - toDayNumber(b);
}

export function isSameDate(a: CivilDate | null, b: CivilDate | null): boolean {
  if (!a || !b) {
    return a === b;
  }

  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export function isSameMonth(a: CivilDate, b: CivilDate): boolean {
  return a.year === b.year && a.month === b.month;
}

/** True when `date` falls inside the inclusive `[min, max]` window. */
export function isWithinRange(
  date: CivilDate,
  min?: CivilDate | null,
  max?: CivilDate | null,
): boolean {
  if (min && compareDates(date, min) < 0) {
    return false;
  }

  if (max && compareDates(date, max) > 0) {
    return false;
  }

  return true;
}

export function clampDate(
  date: CivilDate,
  min?: CivilDate | null,
  max?: CivilDate | null,
): CivilDate {
  if (min && compareDates(date, min) < 0) {
    return min;
  }

  if (max && compareDates(date, max) > 0) {
    return max;
  }

  return date;
}

/** Today in the local timezone, read from the host clock rather than a fixed offset. */
export function today(): CivilDate {
  const now = new Date();

  return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
}

function createMonthFormatter(locale: string, options: Intl.DateTimeFormatOptions) {
  const key = `${locale}|${JSON.stringify(options)}`;
  const cached = MONTH_LABEL_CACHE.get(key);

  if (cached) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' });
  MONTH_LABEL_CACHE.set(key, formatter);

  return formatter;
}

/** `Date` at UTC midnight, used only as an `Intl` input, never for arithmetic. */
function toFormatterInput(date: CivilDate): Date {
  return new Date(Date.UTC(date.year, date.month, date.day));
}

export function formatMonthLabel(
  date: CivilDate,
  locale: string,
  options: { withYear?: boolean; width?: 'long' | 'short' } = {},
): string {
  const { withYear = true, width = 'long' } = options;

  return createMonthFormatter(locale, {
    month: width,
    ...(withYear ? { year: 'numeric' } : {}),
  }).format(toFormatterInput(date));
}

export function formatWeekdayLabel(
  weekday: Weekday,
  locale: string,
  width: 'long' | 'short' | 'narrow' = 'short',
): string {
  // 2023-01-01 was a Sunday, so it anchors the weekday names.
  const anchor = fromDayNumber(toDayNumber({ year: 2023, month: 0, day: 1 }) + weekday);

  return createMonthFormatter(locale, { weekday: width }).format(toFormatterInput(anchor));
}

/** Full accessible label, e.g. "Wednesday, November 18, 2026". */
export function formatDateLabel(date: CivilDate, locale: string): string {
  return createMonthFormatter(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(toFormatterInput(date));
}

export type DateDisplayFormat = 'short' | 'medium' | 'long' | 'full';

export function formatDateValue(
  date: CivilDate,
  locale: string,
  format: DateDisplayFormat = 'medium',
): string {
  return createMonthFormatter(locale, { dateStyle: format }).format(toFormatterInput(date));
}

/**
 * Resolves the first day of the week for a locale, falling back to Sunday when
 * the runtime does not expose `Intl.Locale#getWeekInfo`.
 */
export function resolveWeekStartsOn(locale: string): Weekday {
  try {
    const intlLocale = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const info = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
    const firstDay = info?.firstDay;

    if (typeof firstDay === 'number' && firstDay >= 1 && firstDay <= 7) {
      return (firstDay === 7 ? 0 : firstDay) as Weekday;
    }
  } catch {
    // An invalid locale tag falls back to Sunday rather than breaking the grid.
  }

  return 0;
}

/** Six weeks of dates anchored to the first visible week of the month. */
export function buildCalendarWeeks(
  month: CivilDate,
  weekStartsOn: Weekday,
  weeks = 6,
): CivilDate[][] {
  const first = startOfMonth(month);
  const offset = (weekdayOf(first) - weekStartsOn + 7) % 7;
  const start = addDays(first, -offset);
  const grid: CivilDate[][] = [];

  for (let week = 0; week < weeks; week += 1) {
    const days: CivilDate[] = [];

    for (let day = 0; day < 7; day += 1) {
      days.push(addDays(start, week * 7 + day));
    }

    grid.push(days);
  }

  return grid;
}

/** Weekday order for the header row. */
export function weekdayOrder(weekStartsOn: Weekday): Weekday[] {
  return Array.from({ length: 7 }, (_, index) => ((weekStartsOn + index) % 7) as Weekday);
}
