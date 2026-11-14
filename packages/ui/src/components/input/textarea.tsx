import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cx } from '../../utils/cx';
import type { InputSize } from './input';
import styles from './input.module.css';

export type TextareaSize = InputSize;

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Control size. Defaults to `md`. */
  size?: TextareaSize;
  /** Applies the invalid border and `aria-invalid`. */
  invalid?: boolean;
}

/** Native multi-line input with token sizes and validation state. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    size = 'md',
    invalid = false,
    className,
    disabled,
    readOnly,
    rows = 3,
    ...rest
  },
  ref,
) {
  return (
    <div
      className={cx(styles.field, styles.textareaField)}
      data-size={size}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-read-only={readOnly || undefined}
    >
      <textarea
        ref={ref}
        {...rest}
        rows={rows}
        className={cx(styles.input, styles.textarea, className)}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={invalid || undefined}
      />
    </div>
  );
});
