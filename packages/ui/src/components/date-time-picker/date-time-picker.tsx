'use client';

import { forwardRef, useCallback, useMemo, useState, type HTMLAttributes } from 'react';
import { CalendarDays, X } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import { Button } from '../button';
import {
  Calendar,
  formatDateValue,
  formatISODate,
  isWithinRange,
  parseISODate,
  today,
  type CalendarCaptionLayout,
  type CalendarLabels,
  type CalendarSize,
  type DateDisplayFormat,
  type Weekday,
} from '../calendar';
import { FieldContext, useFieldControl } from '../field/field-context';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '../popover';
import { TimePicker, TimePickerColumn, TimePickerContent } from '../time-picker';
import {
  buildHourOptions,
  buildMinuteOptions,
  buildSecondOptions,
  formatTimeLabel,
  parseTimeValue,
  toTimeValue,
  type TimeFormat,
  type TimeParts,
} from '../time-picker/time-utils';
import fieldStyles from '../date-picker/date-picker.module.css';
import styles from './date-time-picker.module.css';

export type DateTimePickerSize = CalendarSize;

export interface DateTimePickerLabels extends CalendarLabels {
  /** Accessible name for the popover surface. */
  dialog: string;
  /** Label of the shortcut that selects the current date and time. */
  now: string;
  /** Label of the button that closes the panel. */
  done: string;
  /** Accessible name of the clear action. */
  clear: string;
  /** Visible label of the time row. */
  time: string;
  /** Accessible name of the hours column in `timeMode="menu"`. */
  hours: string;
  /** Accessible name of the minutes column in `timeMode="menu"`. */
  minutes: string;
  /** Accessible name of the seconds column in `timeMode="menu"`. */
  seconds: string;
}

const DEFAULT_LABELS: DateTimePickerLabels = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  month: 'Month',
  year: 'Year',
  dialog: 'Choose date and time',
  now: 'Now',
  done: 'Done',
  clear: 'Clear',
  time: 'Time',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
};

const ZERO_TIME: TimeParts = { hours: 0, minutes: 0, seconds: 0 };

const iconSizeBySize: Record<DateTimePickerSize, IconSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

const actionIconSizeBySize: Record<DateTimePickerSize, IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

/** Splits `YYYY-MM-DDTHH:mm[:ss]` without going through `Date`, so no timezone shifts it. */
function splitValue(value: string | null): { date: string | null; time: TimeParts | null } {
  if (!value) {
    return { date: null, time: null };
  }

  const [datePart, timePart] = value.split('T');

  return {
    date: parseISODate(datePart) ? (datePart as string) : null,
    time: parseTimeValue(timePart ?? null),
  };
}

export interface DateTimePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue' | 'children'
> {
  /**
   * Selected date and time as `YYYY-MM-DDTHH:mm`, or `YYYY-MM-DDTHH:mm:ss` with
   * `showSeconds`. It is wall-clock time with no offset, so it never shifts
   * when the host timezone changes.
   */
  value?: string | null;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the next value, or `null` when cleared. */
  onChange?: (value: string | null) => void;
  /** Earliest selectable date, inclusive. */
  minDate?: string;
  /** Latest selectable date, inclusive. */
  maxDate?: string;
  /** Dates to block, either as `YYYY-MM-DD` strings or a predicate on that format. */
  disabledDates?: string[] | ((value: string) => boolean);
  /** Disables the field and prevents the popover from opening. */
  disabled?: boolean;
  /** Text shown while no value is selected. */
  placeholder?: string;
  /**
   * Display format for the date half. A preset maps to `Intl.DateTimeFormat`
   * `dateStyle`; pass a function to receive the `YYYY-MM-DD` part.
   */
  format?: DateDisplayFormat | ((value: string) => string);
  /** 12-hour or 24-hour display. Stored values stay 24-hour. Defaults to `24h`. */
  timeFormat?: TimeFormat;
  /**
   * How the time half is edited. `input` is the segmented field you can type
   * into; `menu` is the scrollable hour, minute, and second columns used by the
   * `TimePicker` panel. Defaults to `input`.
   */
  timeMode?: 'input' | 'menu';
  /** Minute interval offered by the time field. Defaults to `1`. */
  minuteStep?: number;
  /** Adds a seconds segment and stores `HH:mm:ss`. */
  showSeconds?: boolean;
  /** BCP 47 locale used for names and formatting. Defaults to `en-US`. */
  locale?: string;
  /** First day of the week. Derived from `locale` when omitted. */
  weekStartsOn?: Weekday;
  /** Month caption style. Use `select` to jump across months and years. */
  captionLayout?: CalendarCaptionLayout;
  /** Control size. Defaults to `md`. */
  size?: DateTimePickerSize;
  /** Shows the clear action while a value is selected. Defaults to `true`. */
  clearable?: boolean;
  /** Shows the calendar icon at the start of the field. Defaults to `true`. */
  showIcon?: boolean;
  /** Applies the invalid border and `aria-invalid`. */
  invalid?: boolean;
  /** Form field name; renders a hidden input so native forms submit the value. */
  name?: string;
  /** Overrides the built-in accessible names. */
  labels?: Partial<DateTimePickerLabels>;
}

/**
 * Date and time in a single field. The panel holds a calendar and a time half
 * that is either a segmented field or a column menu, and stays open while both
 * are edited; `Done` closes it.
 */
export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  function DateTimePicker(
    {
      value,
      defaultValue,
      onChange,
      minDate,
      maxDate,
      disabledDates,
      disabled = false,
      placeholder = 'Select date and time',
      format = 'medium',
      timeFormat = '24h',
      timeMode = 'input',
      minuteStep = 1,
      showSeconds = false,
      locale = 'en-US',
      weekStartsOn,
      captionLayout = 'label',
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
    const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(
      () => defaultValue ?? null,
    );
    // A time edited before a date is picked lives here until the value is whole.
    const [draftTime, setDraftTime] = useState<TimeParts | null>(null);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? (value ?? null) : uncontrolledValue;
    const { date: datePart, time: timePart } = splitValue(currentValue);
    const time = timePart ?? draftTime ?? ZERO_TIME;
    const timeValue = toTimeValue(time, { showSeconds });
    const showClear = clearable && currentValue !== null && !control.disabled;

    const todayDate = useMemo(() => today(), []);
    const nowDisabled = useMemo(() => {
      const iso = formatISODate(todayDate);
      const inRange = isWithinRange(todayDate, parseISODate(minDate), parseISODate(maxDate));

      if (!inRange) {
        return true;
      }

      return typeof disabledDates === 'function'
        ? disabledDates(iso)
        : (disabledDates?.includes(iso) ?? false);
    }, [todayDate, minDate, maxDate, disabledDates]);

    const parsedDate = parseISODate(datePart);
    const displayDate = parsedDate
      ? typeof format === 'function'
        ? format(datePart as string)
        : formatDateValue(parsedDate, locale, format)
      : null;
    const displayText =
      displayDate && timePart
        ? `${displayDate}, ${formatTimeLabel(timePart, { format: timeFormat, showSeconds, locale })}`
        : null;

    const commit = useCallback(
      (next: string | null) => {
        if (!isControlled) {
          setUncontrolledValue(next);
        }

        if (next !== currentValue) {
          onChange?.(next);
        }
      },
      [currentValue, isControlled, onChange],
    );

    const handleDateSelect = useCallback(
      (next: string) => {
        setDraftTime(null);
        commit(`${next}T${timeValue}`);
      },
      [commit, timeValue],
    );

    const handleTimeChange = useCallback(
      (next: string | null) => {
        const parts = parseTimeValue(next) ?? ZERO_TIME;

        if (!datePart) {
          setDraftTime(parts);
          return;
        }

        setDraftTime(null);
        commit(`${datePart}T${toTimeValue(parts, { showSeconds })}`);
      },
      [commit, datePart, showSeconds],
    );

    /** Writes one unit from the column menu and keeps the rest of the time. */
    const handleTimeParts = useCallback(
      (patch: Partial<TimeParts>) => {
        handleTimeChange(toTimeValue({ ...time, ...patch }, { showSeconds }));
      },
      [handleTimeChange, showSeconds, time],
    );

    const hourOptions = useMemo(() => buildHourOptions(timeFormat, locale), [timeFormat, locale]);
    const minuteOptions = useMemo(() => buildMinuteOptions(minuteStep), [minuteStep]);
    const secondOptions = useMemo(() => buildSecondOptions(), []);

    const handleNow = useCallback(() => {
      const now = new Date();
      const date = formatISODate({
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
      });
      const parts: TimeParts = {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      };

      setDraftTime(null);
      commit(`${date}T${toTimeValue(parts, { showSeconds })}`);
    }, [commit, showSeconds]);

    const handleClear = useCallback(() => {
      setDraftTime(null);
      commit(null);
    }, [commit]);

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
        <Popover open={open} onOpenChange={setOpen}>
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
              {/* The columns sit beside the grid, so the panel is wider than the
                  25rem the popover surface caps at by default. Leaving the cap in
                  place squeezes the body, which then scrolls sideways. */}
              <PopoverContent
                width="auto"
                maxWidth={timeMode === 'menu' ? 'calc(100vw - 2rem)' : undefined}
                aria-label={mergedLabels.dialog}
                className={fieldStyles.popover}
              >
                <div className={styles.body} data-mode={timeMode}>
                  <Calendar
                    value={datePart}
                    onChange={handleDateSelect}
                    minDate={minDate}
                    maxDate={maxDate}
                    disabledDates={disabledDates}
                    locale={locale}
                    weekStartsOn={weekStartsOn}
                    size={size}
                    captionLayout={captionLayout}
                    labels={mergedLabels}
                  />
                  {timeMode === 'menu' ? (
                    <div className={styles.timePanel}>
                      <TimePickerContent>
                        <TimePickerColumn
                          label={mergedLabels.hours}
                          value={time.hours}
                          options={hourOptions}
                          onValueChange={(hours) => handleTimeParts({ hours })}
                          disabled={control.disabled}
                        />
                        <TimePickerColumn
                          label={mergedLabels.minutes}
                          value={time.minutes}
                          options={minuteOptions}
                          onValueChange={(minutes) => handleTimeParts({ minutes })}
                          disabled={control.disabled}
                        />
                        {showSeconds ? (
                          <TimePickerColumn
                            label={mergedLabels.seconds}
                            value={time.seconds}
                            options={secondOptions}
                            onValueChange={(seconds) => handleTimeParts({ seconds })}
                            disabled={control.disabled}
                          />
                        ) : null}
                      </TimePickerContent>
                    </div>
                  ) : null}
                </div>
                {timeMode === 'input' ? (
                  <div className={styles.timeRow}>
                    <span className={styles.timeLabel}>{mergedLabels.time}</span>
                    <div
                      className={styles.timeField}
                      data-seconds={showSeconds || undefined}
                      data-period={timeFormat === '12h' || undefined}
                    >
                      {/* The segmented field without its clock action: the panel is
                          already open, so this is a plain inline editor. It is cut
                          off from the surrounding Field so it does not reuse the
                          control id or submit a second hidden input under the same
                          name. */}
                      <FieldContext.Provider value={null}>
                        <TimePicker
                          value={timeValue}
                          onChange={handleTimeChange}
                          format={timeFormat}
                          minuteStep={minuteStep}
                          showSeconds={showSeconds}
                          locale={locale}
                          size={size}
                          disabled={control.disabled}
                          clearable={false}
                          showIcon={false}
                          placeholder={mergedLabels.time}
                        />
                      </FieldContext.Provider>
                    </div>
                  </div>
                ) : null}
                <div className={styles.footer}>
                  <Button variant="ghost" size="sm" onClick={handleNow} disabled={nowDisabled}>
                    {mergedLabels.now}
                  </Button>
                  <div className={styles.footerActions}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      disabled={currentValue === null && draftTime === null}
                    >
                      {mergedLabels.clear}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
                      {mergedLabels.done}
                    </Button>
                  </div>
                </div>
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
          <input type="hidden" name={control.name} value={currentValue ?? ''} />
        ) : null}
      </div>
    );
  },
);
