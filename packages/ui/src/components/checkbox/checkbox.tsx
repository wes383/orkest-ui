'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import styles from './checkbox.module.css';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Control size. Defaults to `md`. */
  size?: CheckboxSize;
  /** Label rendered beside the control. */
  label?: ReactNode;
  /**
   * Shows the mixed state. This is a visual and ARIA state; it does not change
   * the underlying checked value.
   */
  indeterminate?: boolean;
}

/** Native checkbox with token styling and an independent indeterminate state. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { size = 'md', label, indeterminate = false, className, disabled, onChange, ...rest },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);

    if (indeterminate && inputRef.current) {
      inputRef.current.indeterminate = true;
    }
  }

  return (
    <label
      className={cx(styles.root, className)}
      data-size={size}
      data-disabled={disabled || undefined}
    >
      <input
        ref={setInputRef}
        type="checkbox"
        className={styles.input}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : undefined}
        onChange={handleChange}
        {...rest}
      />
      <span className={styles.control} aria-hidden="true" />
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
});
