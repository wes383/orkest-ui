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
} from 'react';
import { Clock } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../field/field-context';
import { Input, type InputProps, type InputSize } from '../input';
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
  formatTimeLabel,
  isWithinTimeRange,
  parseTimeInput,
  parseTimeValue,
  snapToStep,
  stepTime,
  toTimeValue,
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
  /** Accessible name of the hours column. */
  hours: string;
  /** Accessible name of the minutes column. */
  minutes: string;
  /** Accessible name of the seconds column. */
  seconds: string;
}

const DEFAULT_LABELS: TimePickerLabels = {
  dialog: 'Choose a time',
  open: 'Open time picker',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
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
  /** Adds a seconds column and stores `HH:mm:ss`. */
  showSeconds?: boolean;
  /** Earliest selectable time, inclusive, as `HH:mm`. */
  minTime?: string;
  /** Latest selectable time, inclusive, as `HH:mm`. */
  maxTime?: string;
  /** Disables the input and prevents the panel from opening. */
  disabled?: boolean;
  /** Text shown while no time is selected. */
  placeholder?: string;
  /** Shows a clear action while a time is selected. Defaults to `true`. */
  clearable?: boolean;
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

/** Time input with typed entry, arrow-key stepping, and a scrollable column panel. */
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
  const control = useFieldControl({
    id: rest.id,
    name,
    disabled,
    required: rest['aria-required'] === true,
    invalid,
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

  const displayText = parts
    ? formatTimeLabel(parts, { format, showSeconds, locale })
    : '';
  // A null draft follows the committed value; a string renders what the user typed.
  const [draft, setDraft] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const commit = useCallback(
    (next: TimeParts | null) => {
      const nextValue = next
        ? toTimeValue(clampTime(next, min, max), { showSeconds })
        : null;

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      setDraft(null);

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

  const commitDraft = useCallback(() => {
    if (draft === null) {
      return;
    }

    const parsed = parseTimeInput(draft, { format });

    if (!parsed) {
      setDraft(null);
      return;
    }

    commit(snapToStep(parsed, minuteStep));
  }, [commit, draft, format, minuteStep]);

  const step = useCallback(
    (direction: 1 | -1) => {
      const base = parts ?? clampTime({ hours: 9, minutes: 0, seconds: 0 }, min, max);

      commit(stepTime(base, direction, { minuteStep, min, max }));
    },
    [commit, max, min, minuteStep, parts],
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
        <TimePickerInput
          id={control.id}
          value={draft ?? displayText}
          placeholder={placeholder}
          size={size}
          disabled={control.disabled}
          invalid={control.invalid}
          name={control.name}
          required={control.required}
          clearable={clearable}
          leftIcon={Clock}
          aria-describedby={describedBy}
          autoComplete="off"
          inputMode="numeric"
          suffix={
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
          }
          onValueChange={(next) => {
            if (next === '') {
              setDraft('');

              if (currentValue !== null) {
                commit(null);
              }

              return;
            }

            setDraft(next);
          }}
          onCommit={commitDraft}
          onStep={step}
          onCancel={() => setDraft(null)}
          onBlur={commitDraft}
        />
        <PopoverPortal>
          <PopoverPositioner align="start" sideOffset={6}>
            <PopoverContent width="auto" aria-label={mergedLabels.dialog} className={styles.popover}>
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

export interface TimePickerInputProps
  extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'type'> {
  /** Controlled display text. */
  value?: string;
  /** Called with the next display text as the user types. */
  onValueChange?: (value: string) => void;
  /** Called on Enter, and when the field should commit the typed text. */
  onCommit?: () => void;
  /** Called on Escape, when the typed text should be discarded. */
  onCancel?: () => void;
  /** Called with `1` on ArrowUp and `-1` on ArrowDown. */
  onStep?: (direction: 1 | -1) => void;
}

/**
 * Text field for a time value. It keeps the keyboard contract in one place:
 * arrows step the value, Enter commits, Escape reverts.
 */
export const TimePickerInput = forwardRef<HTMLInputElement, TimePickerInputProps>(
  function TimePickerInput(
    { value, onValueChange, onCommit, onCancel, onStep, onKeyDown, ...rest },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);

    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        assignRef(ref, node);
      },
      [ref],
    );

    return (
      <Input
        ref={setRefs}
        type="text"
        value={value}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (event.defaultPrevented) {
            return;
          }

          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            onStep?.(event.key === 'ArrowUp' ? 1 : -1);
            return;
          }

          if (event.key === 'Enter') {
            event.preventDefault();
            onCommit?.();
            return;
          }

          if (event.key === 'Escape') {
            onCancel?.();
          }
        }}
        onChange={(event) => {
          onValueChange?.(event.currentTarget.value);
        }}
        {...rest}
      />
    );
  },
);

export interface TimePickerContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns to render side by side. */
  children?: React.ReactNode;
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
