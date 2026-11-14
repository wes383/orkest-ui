import { forwardRef, type InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import styles from './input.module.css';

export type InputSize = 'sm' | 'md' | 'lg' | 'xl';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Control size. Defaults to `md`. */
  size?: InputSize;
  /** Applies the invalid border and `aria-invalid`. */
  invalid?: boolean;
  /** Decorative Lucide icon rendered before the input text. */
  leftIcon?: LucideIcon;
  /** Decorative Lucide icon rendered after the input text. */
  rightIcon?: LucideIcon;
}

const iconSizeByInputSize: Record<InputSize, IconSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
};

/** Native single-line input with token sizes, icons, and validation state. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    invalid = false,
    leftIcon,
    rightIcon,
    className,
    disabled,
    readOnly,
    ...rest
  },
  ref,
) {
  const iconSize = iconSizeByInputSize[size];

  return (
    <div
      className={styles.field}
      data-size={size}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-read-only={readOnly || undefined}
    >
      {leftIcon ? (
        <span className={styles.iconSlot}>
          <Icon icon={leftIcon} size={iconSize} />
        </span>
      ) : null}
      <input
        ref={ref}
        {...rest}
        className={cx(styles.input, className)}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={invalid || undefined}
      />
      {rightIcon ? (
        <span className={styles.iconSlot}>
          <Icon icon={rightIcon} size={iconSize} />
        </span>
      ) : null}
    </div>
  );
});
