'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import { IconButton } from '../icon-button';
import {
  CalendarContext,
  useCalendarContext,
  type CalendarCaptionLayout,
  type CalendarLabels,
  type CalendarSize,
} from './calendar-context';
import {
  addDays,
  addMonths,
  clampDate,
  compareDates,
  daysInMonth,
  formatDateLabel,
  formatISODate,
  formatISOMonth,
  formatMonthLabel,
  formatWeekdayLabel,
  isSameDate,
  isSameMonth,
  parseISODate,
  parseISOMonth,
  resolveWeekStartsOn,
  startOfMonth,
  today,
  weekdayOf,
  weekdayOrder,
  buildCalendarWeeks,
  type CivilDate,
  type Weekday,
} from './date-utils';
import styles from './calendar.module.css';

const DEFAULT_LABELS: CalendarLabels = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  month: 'Month',
  year: 'Year',
};

function createDisabledMatcher(
  disabledDates?: string[] | ((value: string) => boolean),
): (date: CivilDate) => boolean {
  if (!disabledDates) {
    return () => false;
  }

  if (typeof disabledDates === 'function') {
    return (date) => disabledDates(formatISODate(date));
  }

  const blocked = new Set(disabledDates);

  return (date) => blocked.has(formatISODate(date));
}

function endOfMonth(date: CivilDate): CivilDate {
  return { year: date.year, month: date.month, day: daysInMonth(date.year, date.month) };
}

export interface CalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** Selected date as `YYYY-MM-DD`. Controlled when provided, including `null`. */
  value?: string | null;
  /** Initial date for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the next `YYYY-MM-DD` value. */
  onChange?: (value: string) => void;
  /** Visible month as `YYYY-MM`. Controlled when provided. */
  month?: string;
  /** Initial visible month for uncontrolled usage. Defaults to the selected date. */
  defaultMonth?: string;
  /** Called when the visible month changes, with `YYYY-MM`. */
  onMonthChange?: (month: string) => void;
  /** Earliest selectable date, inclusive. */
  minDate?: string;
  /** Latest selectable date, inclusive. */
  maxDate?: string;
  /** Dates to block, either as `YYYY-MM-DD` strings or a predicate on that format. */
  disabledDates?: string[] | ((value: string) => boolean);
  /** Disables the whole calendar. */
  disabled?: boolean;
  /** BCP 47 locale used for names and formatting. Defaults to `en-US`. */
  locale?: string;
  /** First day of the week. Derived from `locale` when omitted. */
  weekStartsOn?: Weekday;
  /** Cell and text scale. Defaults to `md`. */
  size?: CalendarSize;
  /** Month caption style. Use `select` to jump across months and years. */
  captionLayout?: CalendarCaptionLayout;
  /** Renders trailing and leading days from adjacent months. Defaults to `true`. */
  showOutsideDays?: boolean;
  /** Overrides the built-in accessible names. */
  labels?: Partial<CalendarLabels>;
  /** Replaces the default header and grid composition. */
  children?: ReactNode;
}

/** Standalone month grid with keyboard navigation and range limits. */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    value,
    defaultValue,
    onChange,
    month,
    defaultMonth,
    onMonthChange,
    minDate,
    maxDate,
    disabledDates,
    disabled = false,
    locale = 'en-US',
    weekStartsOn,
    size = 'md',
    captionLayout = 'label',
    showOutsideDays = true,
    labels,
    className,
    children,
    ...rest
  },
  ref,
) {
  const todayDate = useMemo(() => today(), []);
  const min = useMemo(() => parseISODate(minDate), [minDate]);
  const max = useMemo(() => parseISODate(maxDate), [maxDate]);
  const blocked = useMemo(() => createDisabledMatcher(disabledDates), [disabledDates]);
  const resolvedWeekStartsOn = useMemo(
    () => weekStartsOn ?? resolveWeekStartsOn(locale),
    [weekStartsOn, locale],
  );

  const isValueControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() => parseISODate(defaultValue));
  const selectedDate = isValueControlled ? parseISODate(value) : internalValue;

  const isMonthControlled = month !== undefined;
  const [internalMonth, setInternalMonth] = useState<CivilDate>(() => {
    return (
      parseISOMonth(month) ??
      parseISOMonth(defaultMonth) ??
      startOfMonth(selectedDate ?? todayDate)
    );
  });
  const visibleMonth = isMonthControlled
    ? (parseISOMonth(month) ?? internalMonth)
    : internalMonth;

  const [focusedDate, setFocusedDate] = useState<CivilDate>(() =>
    clampDate(selectedDate ?? todayDate, min, max),
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const shouldFocusRef = useRef(false);

  useEffect(() => {
    if (!shouldFocusRef.current) {
      return;
    }

    shouldFocusRef.current = false;
    const cell = gridRef.current?.querySelector<HTMLElement>(
      `[data-day="${formatISODate(focusedDate)}"]`,
    );
    cell?.focus();
  }, [focusedDate, visibleMonth]);

  const isDateDisabled = useCallback(
    (date: CivilDate) => {
      if (disabled) {
        return true;
      }

      if ((min && compareDates(date, min) < 0) || (max && compareDates(date, max) > 0)) {
        return true;
      }

      return blocked(date);
    },
    [disabled, min, max, blocked],
  );

  const setVisibleMonth = useCallback(
    (next: CivilDate) => {
      const normalized = startOfMonth(next);

      if (isSameMonth(normalized, visibleMonth)) {
        return;
      }

      if (!isMonthControlled) {
        setInternalMonth(normalized);
      }

      onMonthChange?.(formatISOMonth(normalized));
    },
    [isMonthControlled, onMonthChange, visibleMonth],
  );

  const goToMonth = useCallback(
    (amount: number) => {
      setVisibleMonth(addMonths(visibleMonth, amount));
    },
    [setVisibleMonth, visibleMonth],
  );

  const focusDate = useCallback(
    (date: CivilDate, options?: { focus?: boolean }) => {
      const next = clampDate(date, min, max);

      setFocusedDate(next);

      if (!isSameMonth(next, visibleMonth)) {
        setVisibleMonth(next);
      }

      if (options?.focus) {
        shouldFocusRef.current = true;
      }
    },
    [min, max, visibleMonth, setVisibleMonth],
  );

  const selectDate = useCallback(
    (date: CivilDate) => {
      if (isDateDisabled(date)) {
        return;
      }

      if (!isValueControlled) {
        setInternalValue(date);
      }

      setFocusedDate(date);
      onChange?.(formatISODate(date));
    },
    [isDateDisabled, isValueControlled, onChange],
  );

  const contextValue = useMemo(
    () => ({
      visibleMonth,
      todayDate,
      selectedDate,
      focusedDate,
      locale,
      weekStartsOn: resolvedWeekStartsOn,
      size,
      captionLayout,
      showOutsideDays,
      disabled,
      labels: { ...DEFAULT_LABELS, ...labels },
      minDate: min,
      maxDate: max,
      isDateDisabled,
      isDateSelected: (date: CivilDate) => isSameDate(date, selectedDate),
      isDateFocused: (date: CivilDate) => isSameDate(date, focusedDate),
      selectDate,
      focusDate,
      goToMonth,
      setVisibleMonth,
      gridRef,
    }),
    [
      visibleMonth,
      todayDate,
      selectedDate,
      focusedDate,
      locale,
      resolvedWeekStartsOn,
      size,
      captionLayout,
      showOutsideDays,
      disabled,
      labels,
      min,
      max,
      isDateDisabled,
      selectDate,
      focusDate,
      goToMonth,
      setVisibleMonth,
    ],
  );

  return (
    <CalendarContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cx(styles.root, className)}
        data-size={size}
        data-disabled={disabled || undefined}
        {...rest}
      >
        {children ?? (
          <>
            <CalendarHeader />
            <CalendarGrid />
          </>
        )}
      </div>
    </CalendarContext.Provider>
  );
});

export interface CalendarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Replaces the navigation, caption, and select controls. */
  children?: ReactNode;
}

/** Month caption with previous and next navigation. */
export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  function CalendarHeader({ className, children, ...rest }, ref) {
    const context = useCalendarContext();
    const { visibleMonth, minDate, maxDate, labels } = context;
    const atStart = minDate ? compareDates(minDate, startOfMonth(visibleMonth)) >= 0 : false;
    const atEnd = maxDate ? compareDates(maxDate, endOfMonth(visibleMonth)) <= 0 : false;

    return (
      <div ref={ref} className={cx(styles.header, className)} {...rest}>
        {children ?? (
          <>
            <IconButton
              icon={ChevronLeft}
              label={labels.previousMonth}
              variant="ghost"
              size="sm"
              disabled={context.disabled || atStart}
              onClick={() => context.goToMonth(-1)}
            />
            <div className={styles.caption}>
              {context.captionLayout === 'select' ? (
                <CalendarCaptionSelects />
              ) : (
                <span className={styles.monthLabel} aria-live="polite">
                  {formatMonthLabel(visibleMonth, context.locale)}
                </span>
              )}
            </div>
            <IconButton
              icon={ChevronRight}
              label={labels.nextMonth}
              variant="ghost"
              size="sm"
              disabled={context.disabled || atEnd}
              onClick={() => context.goToMonth(1)}
            />
          </>
        )}
      </div>
    );
  },
);

function CalendarCaptionSelects() {
  const { visibleMonth, locale, labels, minDate, maxDate, setVisibleMonth } =
    useCalendarContext();
  const { year: visibleYear } = visibleMonth;

  const startYear = Math.min(minDate?.year ?? 1900, visibleYear);
  const endYear = Math.max(maxDate?.year ?? 2100, visibleYear);
  const years = useMemo(() => {
    const list: number[] = [];

    for (let year = startYear; year <= endYear; year += 1) {
      list.push(year);
    }

    return list;
  }, [startYear, endYear]);

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => ({
      value: index,
      label: formatMonthLabel(
        { year: visibleMonth.year, month: index, day: 1 },
        locale,
        { withYear: false, width: 'long' },
      ),
    }));
  }, [locale, visibleMonth.year]);

  return (
    <>
      <span className={styles.selectWrap}>
        <select
          className={styles.select}
          aria-label={labels.month}
          value={visibleMonth.month}
          onChange={(event) =>
            setVisibleMonth({ ...visibleMonth, month: Number(event.target.value), day: 1 })
          }
        >
          {months.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.selectIcon} aria-hidden="true" />
      </span>
      <span className={styles.selectWrap}>
        <select
          className={styles.select}
          aria-label={labels.year}
          value={visibleMonth.year}
          onChange={(event) =>
            setVisibleMonth({ ...visibleMonth, year: Number(event.target.value), day: 1 })
          }
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.selectIcon} aria-hidden="true" />
      </span>
    </>
  );
}

export interface CalendarGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Hides the weekday header row. */
  showWeekdays?: boolean;
}

/** Six-week day grid with roving tabindex and arrow-key navigation. */
export const CalendarGrid = forwardRef<HTMLDivElement, CalendarGridProps>(
  function CalendarGrid({ className, showWeekdays = true, onKeyDown, ...rest }, ref) {
    const context = useCalendarContext();
    const { visibleMonth, weekStartsOn, locale, showOutsideDays, focusDate, gridRef } = context;
    const weeks = useMemo(
      () => buildCalendarWeeks(visibleMonth, weekStartsOn),
      [visibleMonth, weekStartsOn],
    );

    // The root focuses a day after arrow-key navigation, so the grid must
    // always register itself even when the consumer supplies its own ref.
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        gridRef.current = node;
        assignRef(ref, node);
      },
      [gridRef, ref],
    );

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
      onKeyDown?.(event);

      if (event.defaultPrevented) {
        return;
      }

      const cell = (event.target as HTMLElement).closest<HTMLElement>('[data-day]');
      const current = parseISODate(cell?.dataset.day);
      const offset = current ? (weekdayOf(current) - weekStartsOn + 7) % 7 : 0;
      let next: CivilDate | null = null;

      switch (event.key) {
        case 'ArrowLeft':
          next = current && addDays(current, -1);
          break;
        case 'ArrowRight':
          next = current && addDays(current, 1);
          break;
        case 'ArrowUp':
          next = current && addDays(current, -7);
          break;
        case 'ArrowDown':
          next = current && addDays(current, 7);
          break;
        case 'Home':
          next = current && addDays(current, -offset);
          break;
        case 'End':
          next = current && addDays(current, 6 - offset);
          break;
        case 'PageUp':
          next = current && addMonths(current, event.shiftKey ? -12 : -1);
          break;
        case 'PageDown':
          next = current && addMonths(current, event.shiftKey ? 12 : 1);
          break;
        default:
          return;
      }

      if (!next) {
        return;
      }

      event.preventDefault();
      focusDate(next, { focus: true });
    }

    return (
      <div
        ref={setRefs}
        role="grid"
        tabIndex={-1}
        aria-label={formatMonthLabel(visibleMonth, locale)}
        className={cx(styles.grid, className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {showWeekdays ? (
          <div role="row" className={cx(styles.week, styles.weekdays)}>
            {weekdayOrder(weekStartsOn).map((weekday) => (
              <div
                key={weekday}
                role="columnheader"
                className={styles.weekday}
                aria-label={formatWeekdayLabel(weekday, locale, 'long')}
              >
                {formatWeekdayLabel(weekday, locale, 'short')}
              </div>
            ))}
          </div>
        ) : null}
        {weeks.map((week) => (
          <div role="row" key={formatISODate(week[0] ?? visibleMonth)} className={styles.week}>
            {week.map((date) =>
              showOutsideDays || isSameMonth(date, visibleMonth) ? (
                <CalendarDay key={formatISODate(date)} date={formatISODate(date)} />
              ) : (
                <span key={formatISODate(date)} role="gridcell" className={styles.emptyCell} />
              ),
            )}
          </div>
        ))}
      </div>
    );
  },
);

export interface CalendarDayProps extends HTMLAttributes<HTMLButtonElement> {
  /** Date rendered by this cell, as `YYYY-MM-DD`. */
  date: string;
}

/** Single day cell. Reads selection, range, and focus state from `Calendar`. */
export const CalendarDay = forwardRef<HTMLButtonElement, CalendarDayProps>(
  function CalendarDay({ date, className, onClick, ...rest }, ref) {
    const context = useCalendarContext();
    const parsed = parseISODate(date);

    if (!parsed) {
      throw new Error(`CalendarDay received an invalid date: ${date}`);
    }

    const disabled = context.isDateDisabled(parsed);
    const selected = context.isDateSelected(parsed);
    const isToday = isSameDate(parsed, context.todayDate);
    const outside = !isSameMonth(parsed, context.visibleMonth);

    return (
      <button
        ref={ref}
        type="button"
        role="gridcell"
        className={cx(styles.day, className)}
        data-day={date}
        data-selected={selected || undefined}
        data-today={isToday || undefined}
        data-outside={outside || undefined}
        aria-label={formatDateLabel(parsed, context.locale)}
        aria-selected={selected}
        aria-current={isToday ? 'date' : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={context.isDateFocused(parsed) ? 0 : -1}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented && !disabled) {
            context.selectDate(parsed);
          }
        }}
        onFocus={() => {
          if (!context.isDateFocused(parsed)) {
            context.focusDate(parsed);
          }
        }}
        {...rest}
      >
        {parsed.day}
      </button>
    );
  },
);
