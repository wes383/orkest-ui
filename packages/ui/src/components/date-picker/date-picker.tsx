'use client';

import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type HTMLAttributes,
} from 'react';
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
import { useFieldControl } from '../field/field-context';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '../popover';
import styles from './date-picker.module.css';

export type DatePickerSize = CalendarSize;

export interface DatePickerLabels extends CalendarLabels {
  /** Accessible name for the popover surface. */
  dialog: string;
  /** Label of the shortcut that selects today. */
  today: string;
  /** Accessible name of the clear action. */
  clear: string;
}

const DEFAULT_LABELS: DatePickerLabels = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  month: 'Month',
  year: 'Year',
  dialog: 'Choose a date',
  today: 'Today',
  clear: 'Clear date',
};

const iconSizeBySize: Record<DatePickerSize, IconSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

const actionIconSizeBySize: Record<DatePickerSize, IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export interface DatePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** Selected date as `YYYY-MM-DD`. Controlled when provided, including `null`. */
  value?: string | null;
  /** Initial date for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the next `YYYY-MM-DD` value, or `null` when cleared. */
  onChange?: (value: string | null) => void;
  /** Earliest selectable date, inclusive. */
  minDate?: string;
  /** Latest selectable date, inclusive. */
  maxDate?: string;
  /** Dates to block, either as `YYYY-MM-DD` strings or a predicate on that format. */
  disabledDates?: string[] | ((value: string) => boolean);
  /** Disables the trigger and prevents the popover from opening. */
  disabled?: boolean;
  /** Text shown while no date is selected. */
  placeholder?: string;
  /**
   * Display format. A preset maps to `Intl.DateTimeFormat` `dateStyle`; pass a
   * function for full control, e.g. `(value) => value` for `YYYY-MM-DD`.
   */
  format?: DateDisplayFormat | ((value: string) => string);
  /** BCP 47 locale used for names and formatting. Defaults to `en-US`. */
  locale?: string;
  /** First day of the week. Derived from `locale` when omitted. */
  weekStartsOn?: Weekday;
  /** Month caption style. Use `select` to jump across months and years. */
  captionLayout?: CalendarCaptionLayout;
  /** Control size. Defaults to `md`. */
  size?: DatePickerSize;
  /** Shows a clear action while a date is selected. Defaults to `true`. */
  clearable?: boolean;
  /** Applies the invalid border and `aria-invalid`. */
  invalid?: boolean;
  /** Form field name; renders a hidden input so native forms submit the value. */
  name?: string;
  /** Overrides the built-in accessible names. */
  labels?: Partial<DatePickerLabels>;
}

/** Date input with a popover calendar, range limits, and keyboard navigation. */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  {
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    disabledDates,
    disabled = false,
    placeholder = 'Select a date',
    format = 'medium',
    locale = 'en-US',
    weekStartsOn,
    captionLayout = 'label',
    size = 'md',
    clearable = true,
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

  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value ?? null) : uncontrolledValue;
  const selectedDate = parseISODate(currentValue);
  const showClear = clearable && selectedDate !== null && !control.disabled;

  const todayDate = useMemo(() => today(), []);
  const todayIso = formatISODate(todayDate);
  const todayDisabled = useMemo(() => {
    const inRange = isWithinRange(
      todayDate,
      parseISODate(minDate),
      parseISODate(maxDate),
    );

    if (!inRange) {
      return true;
    }

    return typeof disabledDates === 'function'
      ? disabledDates(todayIso)
      : (disabledDates?.includes(todayIso) ?? false);
  }, [todayDate, todayIso, minDate, maxDate, disabledDates]);

  const displayText = selectedDate
    ? typeof format === 'function'
      ? format(currentValue as string)
      : formatDateValue(selectedDate, locale, format)
    : null;

  const commit = useCallback(
    (next: string | null) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }

      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const handleSelect = useCallback(
    (next: string) => {
      commit(next);
      setOpen(false);
    },
    [commit],
  );

  const handleClear = useCallback(() => {
    commit(null);
    setOpen(false);
  }, [commit]);

  const handleToday = useCallback(() => {
    if (!todayDisabled) {
      handleSelect(todayIso);
    }
  }, [handleSelect, todayDisabled, todayIso]);

  return (
    <div
      ref={ref}
      className={cx(styles.root, className)}
      data-size={size}
      data-disabled={control.disabled || undefined}
      data-clearable={showClear || undefined}
      {...rest}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              id={control.id}
              className={styles.field}
              data-size={size}
              data-invalid={control.invalid || undefined}
              data-placeholder={!displayText || undefined}
              aria-describedby={control.describedBy}
              disabled={control.disabled}
            />
          }
        >
          <span className={styles.iconSlot}>
            <Icon icon={CalendarDays} size={iconSizeBySize[size]} tone="muted" />
          </span>
          <span className={styles.value}>{displayText ?? placeholder}</span>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverPositioner align="start" sideOffset={6}>
            <PopoverContent width="auto" aria-label={mergedLabels.dialog} className={styles.popover}>
              <Calendar
                value={currentValue}
                onChange={handleSelect}
                minDate={minDate}
                maxDate={maxDate}
                disabledDates={disabledDates}
                locale={locale}
                weekStartsOn={weekStartsOn}
                captionLayout={captionLayout}
                size={size}
                labels={mergedLabels}
              />
              <div className={styles.footer}>
                <Button variant="ghost" size="sm" onClick={handleToday}>
                  {mergedLabels.today}
                </Button>
                {clearable ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    disabled={selectedDate === null}
                  >
                    {mergedLabels.clear}
                  </Button>
                ) : null}
              </div>
            </PopoverContent>
          </PopoverPositioner>
        </PopoverPortal>
      </Popover>
      {showClear ? (
        <button
          type="button"
          className={styles.clear}
          aria-label={mergedLabels.clear}
          onClick={handleClear}
        >
          <Icon icon={X} size={actionIconSizeBySize[size]} />
        </button>
      ) : null}
      {control.name ? <input type="hidden" name={control.name} value={currentValue ?? ''} /> : null}
    </div>
  );
});
