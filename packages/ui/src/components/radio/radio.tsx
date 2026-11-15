'use client';

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { cx } from '../../utils/cx';
import styles from './radio.module.css';

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioOrientation = 'horizontal' | 'vertical';

interface RadioGroupContextValue {
  name: string;
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
  required: boolean;
  size: RadioSize;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value'> {
  /** Control size. Defaults to `md`, or the parent RadioGroup size. */
  size?: RadioSize;
  /** Label rendered beside the control. */
  label?: ReactNode;
  /** Option value submitted with the form and used by RadioGroup. */
  value?: string;
}

/** Native radio input with token styling. Use RadioGroup for managed groups. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    size,
    label,
    value,
    className,
    disabled = false,
    required = false,
    checked,
    defaultChecked,
    name,
    onChange,
    ...rest
  },
  ref,
) {
  const group = useContext(RadioGroupContext);
  const resolvedSize = size ?? group?.size ?? 'md';
  const resolvedDisabled = disabled || (group?.disabled ?? false);
  const resolvedRequired = required || (group?.required ?? false);
  const checkedProps = group
    ? { checked: value !== undefined && group.value === value }
    : { checked, defaultChecked };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (group && value !== undefined) {
      group.setValue(value);
    }

    onChange?.(event);
  }

  return (
    <label
      className={cx(styles.root, className)}
      data-size={resolvedSize}
      data-disabled={resolvedDisabled || undefined}
    >
      <input
        ref={ref}
        {...rest}
        {...checkedProps}
        type="radio"
        name={group?.name ?? name}
        value={value}
        disabled={resolvedDisabled}
        required={resolvedRequired}
        className={styles.input}
        onChange={handleChange}
      />
      <span className={styles.control} aria-hidden="true" />
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
});

export interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Shared form name. A stable name is generated when omitted. */
  name?: string;
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the next selected value. */
  onValueChange?: (value: string) => void;
  /** Disables every radio in the group. */
  disabled?: boolean;
  /** Requires a selection in the group. */
  required?: boolean;
  /** Layout direction. Defaults to `vertical`. */
  orientation?: RadioOrientation;
  /** Size applied to radios that do not set their own size. */
  size?: RadioSize;
}

/** Managed radio group with native arrow-key navigation and form semantics. */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    name: nameProp,
    value,
    defaultValue = '',
    onValueChange,
    disabled = false,
    required = false,
    orientation = 'vertical',
    size = 'md',
    className,
    children,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const name = nameProp ?? `radio-group-${generatedId.replace(/:/g, '')}`;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  const contextValue = useMemo(
    () => ({ name, value: currentValue, setValue, disabled, required, size }),
    [name, currentValue, setValue, disabled, required, size],
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        ref={ref}
        {...rest}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        aria-required={required || undefined}
        aria-orientation={orientation}
        className={cx(styles.group, className)}
        data-orientation={orientation}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});
