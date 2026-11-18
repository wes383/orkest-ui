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
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Clock, X } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import { useFieldContext, useFieldControl } from '../field/field-context';
import type { InputSize } from '../input';
import inputStyles from '../input/input.module.css';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '../popover';
import {
  buildHourOptions,
  buildMinuteOptions,
  buildSecondOptions,
  clampTime,
  formatDayPeriod,
  from12Hour,
  getDayPeriod,
  isWithinTimeRange,
  parseTimeValue,
  to12Hour,
  toTimeValue,
  type DayPeriod,
  type TimeFormat,
  type TimeParts,
} from './time-utils';
import styles from './time-picker.module.css';

export type TimePickerSize = Exclude<InputSize, 'xl'>;

export interface TimePickerLabels {
  /** Accessible name for the popover surface. */
  dialog: string;
  /** Accessible name of the button that opens the panel. */
  open: string;
  /** Accessible name of the hours segment. */
  hours: string;
  /** Accessible name of the minutes segment. */
  minutes: string;
  /** Accessible name of the seconds segment. */
  seconds: string;
  /** Accessible name of the day-period segment. */
  period: string;
  /** Accessible name of the clear action. */
  clear: string;
}

const DEFAULT_LABELS: TimePickerLabels = {
  dialog: 'Choose a time',
  open: 'Open time picker',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
  period: 'AM/PM',
  clear: 'Clear input',
};

const iconSizeBySize: Record<TimePickerSize, IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export interface TimePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** Selected time as `HH:mm`, or `HH:mm:ss` with `showSeconds`. */
  value?: string | null;
  /** Initial time for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the next `HH:mm` value, or `null` when cleared. */
  onChange?: (value: string | null) => void;
  /** Display format. Stored values stay 24-hour. Defaults to `24h`. */
  format?: TimeFormat;
  /** Minute interval offered by the picker. Defaults to `1`. */
  minuteStep?: number;
  /** Adds a seconds segment and column and stores `HH:mm:ss`. */
  showSeconds?: boolean;
  /** Earliest selectable time, inclusive, as `HH:mm`. */
  minTime?: string;
  /** Latest selectable time, inclusive, as `HH:mm`. */
  maxTime?: string;
  /** Disables the field and prevents the panel from opening. */
  disabled?: boolean;
  /** Text shown while no time is selected. */
  placeholder?: string;
  /** Shows a clear action while a time is selected. Defaults to `true`. */
  clearable?: boolean;
  /** Shows the clock action that opens the panel. Defaults to `true`. */
  showIcon?: boolean;
  /** Control size. Defaults to `md`. */
  size?: TimePickerSize;
  /** BCP 47 locale used for the 12-hour day period. Defaults to `en-US`. */
  locale?: string;
  /** Applies the invalid border and `aria-invalid`. */
  invalid?: boolean;
  /** Form field name. */
  name?: string;
  /** Overrides the built-in accessible names. */
  labels?: Partial<TimePickerLabels>;
}

/**
 * Time input with one editable segment per unit, arrow-key stepping, and a
 * scrollable column panel.
 */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker(
  {
    value,
    defaultValue,
    onChange,
    format = '24h',
    minuteStep = 1,
    showSeconds = false,
    minTime,
    maxTime,
    disabled = false,
    placeholder = 'Select a time',
    clearable = true,
    showIcon = true,
    size = 'md',
    locale = 'en-US',
    invalid = false,
    name,
    labels,
    className,
    'aria-describedby': describedBy,
    ...rest
  },
  ref,
) {
  const field = useFieldContext();
  const control = useFieldControl({
    id: rest.id,
    name,
    disabled,
    required: rest['aria-required'] === true,
    invalid,
    describedBy,
  });
  const mergedLabels = useMemo(() => ({ ...DEFAULT_LABELS, ...labels }), [labels]);
  const min = useMemo(() => parseTimeValue(minTime), [minTime]);
  const max = useMemo(() => parseTimeValue(maxTime), [maxTime]);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(
    () => defaultValue ?? null,
  );
  const currentValue = isControlled ? (value ?? null) : internalValue;
  const parts = parseTimeValue(currentValue);
  const [open, setOpen] = useState(false);

  const commit = useCallback(
    (next: TimeParts | null) => {
      const nextValue = next
        ? toTimeValue(clampTime(next, min, max), { showSeconds })
        : null;

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      if (nextValue !== currentValue) {
        onChange?.(nextValue);
      }
    },
    [currentValue, isControlled, max, min, onChange, showSeconds],
  );

  const applyParts = useCallback(
    (patch: Partial<TimeParts>) => {
      const base = parts ?? { hours: 0, minutes: 0, seconds: 0 };

      commit({ ...base, ...patch });
    },
    [commit, parts],
  );

  const hourOptions = useMemo(() => buildHourOptions(format, locale), [format, locale]);
  const minuteOptions = useMemo(() => buildMinuteOptions(minuteStep), [minuteStep]);
  const secondOptions = useMemo(() => buildSecondOptions(), []);
  const active = parts ?? { hours: 0, minutes: 0, seconds: 0 };

  return (
    <div
      ref={ref}
      className={cx(styles.root, className)}
      data-size={size}
      data-disabled={control.disabled || undefined}
      {...rest}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <TimePickerField
          id={control.id}
          name={control.name}
          labelId={field?.labelId}
          describedBy={control.describedBy}
          value={parts}
          format={format}
          showSeconds={showSeconds}
          minuteStep={minuteStep}
          locale={locale}
          size={size}
          disabled={control.disabled}
          invalid={control.invalid}
          required={control.required}
          placeholder={placeholder}
          clearable={clearable}
          labels={mergedLabels}
          onCommit={commit}
          leading={
            showIcon ? (
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className={styles.trigger}
                    aria-label={mergedLabels.open}
                    disabled={control.disabled}
                  />
                }
              >
                <Icon icon={Clock} size={iconSizeBySize[size]} />
              </PopoverTrigger>
            ) : undefined
          }
        />
        <PopoverPortal>
          <PopoverPositioner align="start" sideOffset={6}>
            {/* The shared popover floor (12rem) would pad a two-column panel; let the
                columns define the width instead. */}
            <PopoverContent
              width="max-content"
              minWidth={0}
              aria-label={mergedLabels.dialog}
              className={styles.popover}
            >
              <TimePickerContent>
                <TimePickerColumn
                  label={mergedLabels.hours}
                  value={active.hours}
                  options={hourOptions}
                  disabled={control.disabled}
                  onValueChange={(hours) => applyParts({ hours })}
                  isOptionDisabled={(hours) =>
                    !isWithinTimeRange({ ...active, hours }, min, max)
                  }
                />
                <TimePickerColumn
                  label={mergedLabels.minutes}
                  value={active.minutes}
                  options={minuteOptions}
                  disabled={control.disabled}
                  onValueChange={(minutes) => applyParts({ minutes })}
                  isOptionDisabled={(minutes) =>
                    !isWithinTimeRange({ ...active, minutes }, min, max)
                  }
                />
                {showSeconds ? (
                  <TimePickerColumn
                    label={mergedLabels.seconds}
                    value={active.seconds}
                    options={secondOptions}
                    disabled={control.disabled}
                    onValueChange={(seconds) => applyParts({ seconds })}
                    isOptionDisabled={(seconds) =>
                      !isWithinTimeRange({ ...active, seconds }, min, max)
                    }
                  />
                ) : null}
              </TimePickerContent>
            </PopoverContent>
          </PopoverPositioner>
        </PopoverPortal>
      </Popover>
    </div>
  );
});

type TimeSegmentKey = 'hours' | 'minutes' | 'seconds' | 'period';
type NumericSegmentKey = Exclude<TimeSegmentKey, 'period'>;

interface TimeFieldState {
  /** 24-hour value, so the stored value never depends on the display format. */
  hours: number | null;
  minutes: number | null;
  seconds: number | null;
}

const EMPTY_FIELD_STATE: TimeFieldState = { hours: null, minutes: null, seconds: null };

function isCompleteState(state: TimeFieldState, showSeconds: boolean): boolean {
  return (
    state.hours !== null &&
    state.minutes !== null &&
    (!showSeconds || state.seconds !== null)
  );
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

interface TimePickerFieldProps {
  id?: string;
  name?: string;
  labelId?: string;
  describedBy?: string;
  value: TimeParts | null;
  format: TimeFormat;
  showSeconds: boolean;
  minuteStep: number;
  locale: string;
  size: TimePickerSize;
  disabled: boolean;
  invalid: boolean;
  required: boolean;
  placeholder: string;
  clearable: boolean;
  labels: TimePickerLabels;
  /** The clock action, rendered before the segments. */
  leading?: ReactNode;
  onCommit: (value: TimeParts | null) => void;
}

/**
 * Field body split into one spinbutton per time unit. Each segment takes typed
 * digits, arrow-key steps, and moves with the horizontal arrows, so every unit
 * can be edited on its own without a mask or a caret.
 */
function TimePickerField({
  id,
  name,
  labelId,
  describedBy,
  value,
  format,
  showSeconds,
  minuteStep,
  locale,
  size,
  disabled,
  invalid,
  required,
  placeholder,
  clearable,
  labels,
  leading,
  onCommit,
}: TimePickerFieldProps) {
  const [draft, setDraft] = useState<TimeFieldState | null>(null);
  const [focused, setFocused] = useState(false);
  // Digits typed into one segment before it advances, e.g. `1` then `4`.
  const buffer = useRef<{ segment: TimeSegmentKey | null; digits: string }>({
    segment: null,
    digits: '',
  });
  const segmentNodes = useRef<Partial<Record<TimeSegmentKey, HTMLSpanElement | null>>>({});

  const committed = useMemo<TimeFieldState | null>(
    () =>
      value
        ? { hours: value.hours, minutes: value.minutes, seconds: value.seconds }
        : null,
    [value],
  );
  const state = draft ?? committed;
  const order = useMemo<TimeSegmentKey[]>(() => {
    const keys: TimeSegmentKey[] = showSeconds
      ? ['hours', 'minutes', 'seconds']
      : ['hours', 'minutes'];

    if (format === '12h') {
      keys.push('period');
    }

    return keys;
  }, [format, showSeconds]);

  const empty = state === null;
  const showPlaceholder = empty && !focused && placeholder.length > 0;
  const showClear = clearable && value !== null && !disabled;

  const displayHours = state?.hours ?? null;
  // Two digits in both formats: the segment keeps a fixed width, so the colon
  // never drifts when a single-digit hour becomes a two-digit one.
  const hourText = displayHours === null ? null : pad2(format === '12h' ? to12Hour(displayHours) : displayHours);
  const minuteText = state?.minutes === null || state?.minutes === undefined
    ? null
    : pad2(state.minutes);
  const secondText = state?.seconds === null || state?.seconds === undefined
    ? null
    : pad2(state.seconds);
  const periodText = displayHours === null ? null : formatDayPeriod(displayHours, locale);

  function resetBuffer() {
    buffer.current = { segment: null, digits: '' };
  }

  function resetDraft() {
    setDraft(null);
    resetBuffer();
  }

  function focusSegment(key: TimeSegmentKey) {
    segmentNodes.current[key]?.focus();
  }

  function moveFocus(key: TimeSegmentKey, direction: 1 | -1) {
    const index = order.indexOf(key);
    const next = order[Math.min(Math.max(index + direction, 0), order.length - 1)];

    if (next && next !== key) {
      focusSegment(next);
    }
  }

  function commitState(next: TimeFieldState) {
    if (!isCompleteState(next, showSeconds)) {
      setDraft(next);
      return;
    }

    setDraft(null);
    onCommit({
      hours: next.hours as number,
      minutes: next.minutes as number,
      seconds: next.seconds ?? 0,
    });
  }

  /** Writes a value that is already expressed in the segment's own unit. */
  function writeSegment(key: TimeSegmentKey, amount: number) {
    const base = state ?? EMPTY_FIELD_STATE;

    if (key === 'period') {
      setPeriod(amount === 1 ? 'pm' : 'am');
      return;
    }

    if (key === 'hours') {
      const hours = format === '12h' ? from12Hour(amount, getDayPeriod(base.hours)) : amount;

      commitState({ ...base, hours });
      return;
    }

    commitState({ ...base, [key]: amount });
  }

  function setPeriod(period: DayPeriod) {
    const base = state ?? EMPTY_FIELD_STATE;
    const hours =
      base.hours === null
        ? period === 'pm'
          ? 12
          : 0
        : from12Hour(to12Hour(base.hours), period);

    commitState({ ...base, hours });
  }

  function stepSegment(key: TimeSegmentKey, direction: 1 | -1) {
    const base = state ?? EMPTY_FIELD_STATE;

    if (key === 'period') {
      setPeriod(direction > 0 ? 'pm' : 'am');
      return;
    }

    if (key === 'hours') {
      if (base.hours === null) {
        writeSegment('hours', format === '12h' ? (direction > 0 ? 1 : 12) : direction > 0 ? 0 : 23);
        return;
      }

      if (format === '12h') {
        const next = ((to12Hour(base.hours) - 1 + direction + 12) % 12) + 1;

        writeSegment('hours', next);
        return;
      }

      writeSegment('hours', (base.hours + direction + 24) % 24);
      return;
    }

    if (key === 'minutes') {
      const step = Math.max(1, Math.floor(minuteStep));

      if (base.minutes === null) {
        writeSegment('minutes', direction > 0 ? 0 : 60 - step);
        return;
      }

      writeSegment('minutes', (((base.minutes + direction * step) % 60) + 60) % 60);
      return;
    }

    if (base.seconds === null) {
      writeSegment('seconds', direction > 0 ? 0 : 59);
      return;
    }

    writeSegment('seconds', (base.seconds + direction + 60) % 60);
  }

  function typeDigit(key: NumericSegmentKey, digit: number, max: number) {
    const previous = buffer.current.segment === key ? buffer.current.digits : '';
    const digits = `${previous}${digit}`;

    if (digits.length === 1) {
      const firstDigitMax = Math.floor(max / 10);

      writeSegment(key, digit);

      if (digit > firstDigitMax) {
        resetBuffer();
        moveFocus(key, 1);
        return;
      }

      buffer.current = { segment: key, digits };
      return;
    }

    const next = Number(digits) > max ? digit : Number(digits);

    resetBuffer();
    writeSegment(key, next);
    moveFocus(key, 1);
  }

  function clearSegment(key: NumericSegmentKey) {
    const base = state ?? EMPTY_FIELD_STATE;

    if (base[key] === null) {
      moveFocus(key, -1);
      return;
    }

    const next: TimeFieldState = { ...base, [key]: null };

    if (next.hours === null && next.minutes === null && next.seconds === null) {
      setDraft(null);
      onCommit(null);
      return;
    }

    setDraft(next);
  }

  function handleSegmentKeyDown(key: TimeSegmentKey, event: KeyboardEvent<HTMLSpanElement>) {
    if (disabled) {
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveFocus(key, event.key === 'ArrowRight' ? 1 : -1);
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      focusSegment(order[event.key === 'Home' ? 0 : order.length - 1] as TimeSegmentKey);
      return;
    }

    if (key === 'period') {
      if (/^[ap]$/i.test(event.key)) {
        event.preventDefault();
        setPeriod(event.key.toLowerCase() === 'a' ? 'am' : 'pm');
        return;
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        stepSegment('period', event.key === 'ArrowUp' ? 1 : -1);
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        resetDraft();
      }

      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      stepSegment(key, event.key === 'ArrowUp' ? 1 : -1);
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      clearSegment(key);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      resetDraft();
      return;
    }

    if (event.key === 'Enter') {
      if (state && isCompleteState(state, showSeconds)) {
        event.preventDefault();
        event.currentTarget.blur();
      }

      return;
    }

    if (event.key === ':') {
      event.preventDefault();
      moveFocus(key, 1);
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      typeDigit(key, Number(event.key), key === 'hours' && format === '12h' ? 12 : key === 'hours' ? 23 : 59);
    }
  }

  function handleFieldMouseDown(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

    if (target.closest('[data-segment]') || target.closest('button')) {
      return;
    }

    const separator = target.closest<HTMLElement>('[data-separator]');
    const next = separator?.nextElementSibling;

    event.preventDefault();

    if (next instanceof HTMLElement && next.dataset.segment) {
      next.focus();
      return;
    }

    focusSegment(order[0] as TimeSegmentKey);
  }

  function renderSegment(
    key: TimeSegmentKey,
    config: {
      text: string | null;
      ghost: string;
      now: number | null;
      min: number;
      max: number;
    },
  ) {
    return (
      <span
        key={key}
        ref={(node) => {
          segmentNodes.current[key] = node;
        }}
        role="spinbutton"
        tabIndex={disabled ? -1 : 0}
        data-segment={key}
        data-placeholder={config.text === null ? true : undefined}
        className={cx(styles.segment, key === 'period' && styles.period)}
        aria-label={labels[key]}
        aria-valuemin={config.min}
        aria-valuemax={config.max}
        aria-valuenow={config.now ?? undefined}
        aria-valuetext={config.text ?? undefined}
        aria-required={required || undefined}
        aria-disabled={disabled || undefined}
        aria-invalid={invalid || undefined}
        onKeyDown={(event) => handleSegmentKeyDown(key, event)}
      >
        {config.text ?? config.ghost}
      </span>
    );
  }

  return (
    <div
      role="presentation"
      className={cx(inputStyles.field, styles.field)}
      data-size={size}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-actions={showClear || undefined}
      data-leading={leading ? true : undefined}
      onMouseDown={handleFieldMouseDown}
    >
      {leading}
      <div
        id={id}
        role="group"
        className={styles.segments}
        data-empty={showPlaceholder || undefined}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-disabled={disabled || undefined}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
            return;
          }

          setFocused(false);
          resetDraft();
        }}
      >
        {renderSegment('hours', {
          text: hourText,
          ghost: 'hh',
          now:
            displayHours === null
              ? null
              : format === '12h'
                ? to12Hour(displayHours)
                : displayHours,
          min: format === '12h' ? 1 : 0,
          max: format === '12h' ? 12 : 23,
        })}
        <span className={styles.separator} data-separator aria-hidden="true">
          :
        </span>
        {renderSegment('minutes', {
          text: minuteText,
          ghost: 'mm',
          now: state?.minutes ?? null,
          min: 0,
          max: 59,
        })}
        {showSeconds ? (
          <>
            <span className={styles.separator} data-separator aria-hidden="true">
              :
            </span>
            {renderSegment('seconds', {
              text: secondText,
              ghost: 'ss',
              now: state?.seconds ?? null,
              min: 0,
              max: 59,
            })}
          </>
        ) : null}
        {format === '12h'
          ? renderSegment('period', {
              text: periodText,
              ghost: '--',
              now: displayHours === null ? null : getDayPeriod(displayHours) === 'pm' ? 1 : 0,
              min: 0,
              max: 1,
            })
          : null}
        {showPlaceholder ? (
          <span className={styles.placeholder} aria-hidden="true">
            {placeholder}
          </span>
        ) : null}
      </div>
      {showClear ? (
        <button
          type="button"
          className={inputStyles.action}
          aria-label={labels.clear}
          onClick={() => {
            setDraft(null);
            resetBuffer();
            onCommit(null);
            focusSegment(order[0] as TimeSegmentKey);
          }}
        >
          <Icon icon={X} size={iconSizeBySize[size]} />
        </button>
      ) : null}
      <input type="hidden" name={name} value={value ? toTimeValue(value, { showSeconds }) : ''} />
    </div>
  );
}

export interface TimePickerContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns to render side by side. */
  children?: ReactNode;
}

/** Panel body that lays out hour, minute, and second columns. */
export const TimePickerContent = forwardRef<HTMLDivElement, TimePickerContentProps>(
  function TimePickerContent({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cx(styles.columns, className)} {...rest}>
        {children}
      </div>
    );
  },
);

export interface TimePickerColumnOption {
  value: number;
  label: string;
}

export interface TimePickerColumnProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name of the list. */
  label: string;
  /** Selected value. */
  value: number;
  /** Options in display order. */
  options: TimePickerColumnOption[];
  /** Called with the next value when an option is chosen. */
  onValueChange: (value: number) => void;
  /** Disables the whole column. */
  disabled?: boolean;
  /** Marks individual options as unavailable. */
  isOptionDisabled?: (value: number) => boolean;
}

/** Scrollable list of time options with arrow-key navigation. */
export const TimePickerColumn = forwardRef<HTMLDivElement, TimePickerColumnProps>(
  function TimePickerColumn(
    { label, value, options, onValueChange, disabled = false, isOptionDisabled, className, ...rest },
    ref,
  ) {
    const listRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLButtonElement>(null);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        assignRef(ref, node);
      },
      [ref],
    );

    useEffect(() => {
      selectedRef.current?.scrollIntoView?.({ block: 'nearest' });
    }, []);

    function moveTo(index: number) {
      const option = options[index];

      if (!option || disabled || isOptionDisabled?.(option.value)) {
        return;
      }

      onValueChange(option.value);
      const node = listRef.current?.querySelector<HTMLElement>(
        `[data-value="${option.value}"]`,
      );
      node?.focus();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const container = event.currentTarget.parentElement;
        const columns = container
          ? Array.from(container.querySelectorAll<HTMLElement>('[role="listbox"]'))
          : [];
        const index = columns.indexOf(event.currentTarget);
        const next = columns[index + (event.key === 'ArrowRight' ? 1 : -1)];

        if (!next) {
          return;
        }

        event.preventDefault();
        const adjacent = next.querySelector<HTMLElement>('[aria-selected="true"]');
        (adjacent ?? next).focus();
        return;
      }

      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') {
        return;
      }

      const index = options.findIndex((option) => option.value === value);
      let nextIndex: number;

      if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = options.length - 1;
      } else {
        nextIndex = index + (event.key === 'ArrowDown' ? 1 : -1);
      }

      nextIndex = Math.min(Math.max(nextIndex, 0), options.length - 1);

      if (nextIndex === index) {
        return;
      }

      event.preventDefault();
      moveTo(nextIndex);
    }

    return (
      <div
        ref={setRefs}
        role="listbox"
        tabIndex={-1}
        aria-label={label}
        aria-disabled={disabled || undefined}
        aria-orientation="vertical"
        className={cx(styles.column, className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {options.map((option) => {
          const selected = option.value === value;
          const optionDisabled = disabled || Boolean(isOptionDisabled?.(option.value));

          return (
            <button
              key={option.value}
              ref={selected ? selectedRef : undefined}
              type="button"
              role="option"
              data-value={option.value}
              className={styles.item}
              aria-selected={selected}
              aria-disabled={optionDisabled || undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                if (!optionDisabled) {
                  onValueChange(option.value);
                }
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  },
);
