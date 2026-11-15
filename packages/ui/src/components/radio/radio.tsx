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
import {
  mergeIds,
  useFieldContext,
  useFieldControl,
} from '../field/field-context';
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
    'aria-labelledby': ariaLabelledBy,
    ...rest
  },
  ref,
) {
  const group = useContext(RadioGroupContext);
  const field = useFieldContext();
  const control = useFieldControl({
    id: rest.id,
    name: group ? group.name : name,
    disabled: disabled || group?.disabled,
    required: required || group?.required,
    describedBy: rest['aria-describedby'],
    inheritId: !group,
  });
  const resolvedSize = size ?? group?.size ?? 'md';
  const resolvedDisabled = control.disabled;
  const resolvedRequired = control.required;
  const resolvedName = group?.name ?? control.name;
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
        id={control.id}
        name={resolvedName}
        value={value}
        disabled={resolvedDisabled}
        required={resolvedRequired}
        aria-describedby={control.describedBy}
        aria-labelledby={
          ariaLabelledBy ?? (group ? undefined : field?.labelId)
        }
        {...(control.invalid ? { 'aria-invalid': true as const } : {})}
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
  /** Applies the invalid state to the group. */
  invalid?: boolean;
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
    invalid = false,
    orientation = 'vertical',
    size = 'md',
    className,
    children,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const field = useFieldContext();
  const generatedId = useId();
  const name =
    nameProp ??
    field?.name ??
    `radio-group-${generatedId.replace(/:/g, '')}`;
  const resolvedDisabled = disabled || field?.disabled || false;
  const resolvedRequired = required || field?.required || false;
  const resolvedInvalid = invalid || field?.invalid || false;
  const resolvedDescribedBy = mergeIds(ariaDescribedBy, field?.describedBy);
  const resolvedLabelledBy = ariaLabelledBy ?? field?.labelId;
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
    () => ({
      name,
      value: currentValue,
      setValue,
      disabled: resolvedDisabled,
      required: resolvedRequired,
      size,
    }),
    [name, currentValue, setValue, resolvedDisabled, resolvedRequired, size],
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        ref={ref}
        {...rest}
        role="radiogroup"
        aria-disabled={resolvedDisabled || undefined}
        aria-required={resolvedRequired || undefined}
        aria-invalid={resolvedInvalid || undefined}
        aria-labelledby={resolvedLabelledBy}
        aria-describedby={resolvedDescribedBy}
        aria-orientation={orientation}
        className={cx(styles.group, className)}
        data-orientation={orientation}
        data-invalid={resolvedInvalid || undefined}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});
