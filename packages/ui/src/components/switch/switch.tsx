'use client';

import {
  forwardRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { cx } from '../../utils/cx';
import { useFieldContext, useFieldControl } from '../field/field-context';
import styles from './switch.module.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Control size. Defaults to `md`. */
  size?: SwitchSize;
  /** Label rendered beside the switch. */
  label?: ReactNode;
}

/** Native checkbox rendered as a switch with role and aria-checked semantics. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    size = 'md',
    label,
    className,
    checked,
    defaultChecked = false,
    disabled,
    onChange,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  },
  ref,
) {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? checked : internalChecked;
  const field = useFieldContext();
  const control = useFieldControl({
    id: rest.id,
    name: rest.name,
    disabled,
    required: rest.required,
    describedBy: ariaDescribedBy,
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setInternalChecked(event.currentTarget.checked);
    }

    onChange?.(event);
  }

  return (
    <label
      className={cx(styles.root, className)}
      data-size={size}
      data-disabled={control.disabled || undefined}
      data-checked={isChecked || undefined}
    >
      <input
        ref={ref}
        {...rest}
        type="checkbox"
        role="switch"
        id={control.id}
        name={control.name}
        aria-checked={isChecked}
        aria-describedby={control.describedBy}
        aria-labelledby={ariaLabelledBy ?? field?.labelId}
        {...(control.invalid ? { 'aria-invalid': true as const } : {})}
        checked={isChecked}
        disabled={control.disabled}
        required={control.required}
        className={styles.input}
        onChange={handleChange}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
});
