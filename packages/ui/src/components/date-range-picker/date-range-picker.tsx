'use client';

import { forwardRef, useCallback, useMemo, useState, type HTMLAttributes } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import { Button } from '../button';
import {
  addMonths,
  Calendar,
  CalendarGrid,
  formatDateValue,
  formatISOMonth,
  formatMonthLabel,
  parseISODate,
  startOfMonth,
  today,
  type CalendarLabels,
  type CalendarRange,
  type DateDisplayFormat,
  type Weekday,
} from '../calendar';
import { useFieldControl } from '../field/field-context';
import { IconButton } from '../icon-button';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '../popover';
import fieldStyles from '../date-picker/date-picker.module.css';
import styles from './date-range-picker.module.css';

export type DateRangePickerSize = 'sm' | 'md' | 'lg';

/** A start and an end date, both as `YYYY-MM-DD`. */
export interface DateRange {
  /** First day of the range, inclusive. */
  start: string;
  /** Last day of the range, inclusive. */
  end: string;
}

export interface DateRangePickerLabels extends CalendarLabels {
  /** Accessible name for the popover surface. */
  dialog: string;
  /** Accessible name of the clear action. */
  clear: string;
}

const DEFAULT_LABELS: DateRangePickerLabels = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  month: 'Month',
  year: 'Year',
  dialog: 'Choose a date range',
  clear: 'Clear range',
};

const iconSizeBySize: Record<DateRangePickerSize, IconSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

const actionIconSizeBySize: Record<DateRangePickerSize, IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export interface DateRangePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue' | 'children'
> {
  /** Selected range. Controlled when provided, including `null`. */
  value?: DateRange | null;
  /** Initial range for uncontrolled usage. */
  defaultValue?: DateRange;
  /** Called with the next range once both ends are picked, or `null` when cleared. */
  onChange?: (value: DateRange | null) => void;
  /** Earliest selectable date, inclusive. */
  minDate?: string;
  /** Latest selectable date, inclusive. */
  maxDate?: string;
  /** Dates to block, either as `YYYY-MM-DD` strings or a predicate on that format. */
  disabledDates?: string[] | ((value: string) => boolean);
  /** Months shown side by side. Defaults to `2`. */
  months?: 1 | 2;
  /** Disables the field and prevents the popover from opening. */
  disabled?: boolean;
  /** Text shown while no range is selected. */
  placeholder?: string;
  /** Sits between the two dates in the field. Defaults to an en dash. */
  separator?: string;
  /**
   * Display format applied to each end. A preset maps to `Intl.DateTimeFormat`
   * `dateStyle`; pass a function for full control.
   */
  format?: DateDisplayFormat | ((value: string) => string);
  /** BCP 47 locale used for names and formatting. Defaults to `en-US`. */
  locale?: string;
  /** First day of the week. Derived from `locale` when omitted. */
  weekStartsOn?: Weekday;
  /** Control size. Defaults to `md`. */
  size?: DateRangePickerSize;
  /** Shows the clear action while a range is selected. Defaults to `true`. */
  clearable?: boolean;
  /** Shows the calendar icon at the start of the field. Defaults to `true`. */
  showIcon?: boolean;
  /** Applies the invalid border and `aria-invalid`. */
  invalid?: boolean;
  /**
   * Form field name. Renders two hidden inputs, `${name}-start` and
   * `${name}-end`, so native forms submit both ends.
   */
  name?: string;
  /** Overrides the built-in accessible names. */
  labels?: Partial<DateRangePickerLabels>;
}

/** Two-month calendar that picks a start and an end date in one popover. */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      value,
      defaultValue,
      onChange,
      minDate,
      maxDate,
      disabledDates,
      months = 2,
      disabled = false,
      placeholder = 'Start date – End date',
      separator = '–',
      format = 'medium',
      locale = 'en-US',
      weekStartsOn,
      size = 'md',
      clearable = true,
      showIcon = true,
      invalid = false,
      name,
      labels,
      className,
      id,
      ...rest
    },
    ref,
  ) {
    const control = useFieldControl({ id, name, disabled, invalid });
    const mergedLabels = useMemo(() => ({ ...DEFAULT_LABELS, ...labels }), [labels]);
    const [open, setOpen] = useState(false);
    const [uncontrolledValue, setUncontrolledValue] = useState<DateRange | null>(
      () => defaultValue ?? null,
    );
    // First click of a new range; the second click closes it.
    const [draftStart, setDraftStart] = useState<string | null>(null);
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);
    // `null` means "follow the selection"; a string means the user navigated.
    const [navigatedMonth, setNavigatedMonth] = useState<string | null>(null);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? (value ?? null) : uncontrolledValue;
    const showClear = clearable && currentValue !== null && !control.disabled;

    const rangeStart = draftStart ?? currentValue?.start ?? null;
    const rangeEnd = draftStart ? null : (currentValue?.end ?? null);
    const preview = draftStart && hoveredDay && hoveredDay > draftStart ? hoveredDay : null;

    const firstMonth = useMemo(() => {
      if (navigatedMonth) {
        return startOfMonth(parseISODate(`${navigatedMonth}-01`) ?? today());
      }

      const anchor = parseISODate(currentValue?.start) ?? today();

      return startOfMonth(anchor);
    }, [navigatedMonth, currentValue?.start]);

    const panels = useMemo(
      () => Array.from({ length: months }, (_, index) => addMonths(firstMonth, index)),
      [firstMonth, months],
    );

    const firstMonthIso = formatISOMonth(firstMonth);
    const lastMonthIso = formatISOMonth(addMonths(firstMonth, months - 1));
    const minMonth = parseISODate(minDate) ? minDate?.slice(0, 7) : undefined;
    const maxMonth = parseISODate(maxDate) ? maxDate?.slice(0, 7) : undefined;
    const atStart = minMonth ? firstMonthIso <= minMonth : false;
    const atEnd = maxMonth ? lastMonthIso >= maxMonth : false;

    const formatEnd = useCallback(
      (iso: string) => {
        if (typeof format === 'function') {
          return format(iso);
        }

        const date = parseISODate(iso);

        return date ? formatDateValue(date, locale, format) : iso;
      },
      [format, locale],
    );

    const displayText = currentValue
      ? `${formatEnd(currentValue.start)} ${separator} ${formatEnd(currentValue.end)}`
      : null;

    const commit = useCallback(
      (next: DateRange | null) => {
        if (!isControlled) {
          setUncontrolledValue(next);
        }

        onChange?.(next);
      },
      [isControlled, onChange],
    );

    const handleOpenChange = useCallback((next: boolean) => {
      setOpen(next);
      setDraftStart(null);
      setHoveredDay(null);

      if (next) {
        // Reopen on the selected month rather than wherever the user left off.
        setNavigatedMonth(null);
      }
    }, []);

    const handleSelect = useCallback(
      (iso: string) => {
        if (draftStart === null) {
          setDraftStart(iso);
          setHoveredDay(null);
          return;
        }

        const [start, end] = iso < draftStart ? [iso, draftStart] : [draftStart, iso];

        setDraftStart(null);
        setHoveredDay(null);
        commit({ start, end });
        setOpen(false);
      },
      [commit, draftStart],
    );

    const handleClear = useCallback(() => {
      setDraftStart(null);
      setHoveredDay(null);
      commit(null);
    }, [commit]);

    // Preview follows both the pointer and the keyboard focus, so the span is
    // visible before either click or `Enter` commits it.
    const trackDay = useCallback(
      (target: EventTarget | null) => {
        if (!draftStart) {
          return;
        }

        const day = (target as HTMLElement | null)?.closest?.<HTMLElement>('[data-day]');
        const next = day?.dataset.day ?? null;

        setHoveredDay((previous) => (previous === next ? previous : next));
      },
      [draftStart],
    );

    const range: CalendarRange = { start: rangeStart, end: rangeEnd, preview };

    return (
      <div
        ref={ref}
        className={cx(fieldStyles.root, className)}
        data-size={size}
        data-disabled={control.disabled || undefined}
        data-clearable={showClear || undefined}
        data-icon={showIcon ? undefined : 'none'}
        {...rest}
      >
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger
            render={
              <button
                type="button"
                id={control.id}
                className={fieldStyles.field}
                data-size={size}
                data-invalid={control.invalid || undefined}
                data-placeholder={!displayText || undefined}
                aria-describedby={control.describedBy}
                disabled={control.disabled}
              />
            }
          >
            {showIcon ? (
              <span className={fieldStyles.iconSlot}>
                <Icon icon={CalendarDays} size={iconSizeBySize[size]} tone="muted" />
              </span>
            ) : null}
            <span className={fieldStyles.value}>{displayText ?? placeholder}</span>
          </PopoverTrigger>
          <PopoverPortal>
            <PopoverPositioner align="start" sideOffset={6}>
              <PopoverContent
                width="max-content"
                minWidth={0}
                maxWidth="calc(100vw - 2rem)"
                aria-label={mergedLabels.dialog}
                className={fieldStyles.popover}
              >
                <div
                  className={styles.panels}
                  data-months={months}
                  onMouseOver={(event) => trackDay(event.target)}
                  onFocus={(event) => trackDay(event.target)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setHoveredDay(null);
                    }
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {panels.map((month, index) => {
                    const monthIso = formatISOMonth(month);

                    return (
                      <div key={monthIso} className={styles.panel}>
                        <div className={styles.nav}>
                          {index === 0 ? (
                            <IconButton
                              icon={ChevronLeft}
                              label={mergedLabels.previousMonth}
                              variant="ghost"
                              size="sm"
                              disabled={atStart}
                              onClick={() =>
                                setNavigatedMonth(formatISOMonth(addMonths(firstMonth, -1)))
                              }
                            />
                          ) : (
                            <span className={styles.navSpacer} />
                          )}
                          <span className={styles.caption}>{formatMonthLabel(month, locale)}</span>
                          {index === panels.length - 1 ? (
                            <IconButton
                              icon={ChevronRight}
                              label={mergedLabels.nextMonth}
                              variant="ghost"
                              size="sm"
                              disabled={atEnd}
                              onClick={() =>
                                setNavigatedMonth(formatISOMonth(addMonths(firstMonth, 1)))
                              }
                            />
                          ) : (
                            <span className={styles.navSpacer} />
                          )}
                        </div>
                        <Calendar
                          month={monthIso}
                          value={rangeStart}
                          range={range}
                          minDate={minDate}
                          maxDate={maxDate}
                          disabledDates={disabledDates}
                          locale={locale}
                          weekStartsOn={weekStartsOn}
                          size={size}
                          labels={mergedLabels}
                          onChange={handleSelect}
                        >
                          <CalendarGrid />
                        </Calendar>
                      </div>
                    );
                  })}
                </div>
                {clearable ? (
                  <div className={cx(fieldStyles.footer, styles.footer)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      disabled={currentValue === null}
                    >
                      {mergedLabels.clear}
                    </Button>
                  </div>
                ) : null}
              </PopoverContent>
            </PopoverPositioner>
          </PopoverPortal>
        </Popover>
        {showClear ? (
          <button
            type="button"
            className={fieldStyles.clear}
            aria-label={mergedLabels.clear}
            onClick={handleClear}
          >
            <Icon icon={X} size={actionIconSizeBySize[size]} />
          </button>
        ) : null}
        {control.name ? (
          <>
            <input type="hidden" name={`${control.name}-start`} value={currentValue?.start ?? ''} />
            <input type="hidden" name={`${control.name}-end`} value={currentValue?.end ?? ''} />
          </>
        ) : null}
      </div>
    );
  },
);
