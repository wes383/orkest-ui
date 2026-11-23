import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { LoaderCircle, type LucideIcon } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import styles from './button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Control size. Defaults to `md`. */
  size?: ButtonSize;
  /** Decorative Lucide icon rendered before the label. */
  leftIcon?: LucideIcon;
  /** Decorative Lucide icon rendered after the label. */
  rightIcon?: LucideIcon;
  /**
   * Disables the button, exposes `aria-busy`, and replaces the leading icon
   * with a spinner so repeated submissions are blocked.
   */
  loading?: boolean;
  /** Stretches the button to the width of its container. */
  fullWidth?: boolean;
  /**
   * Renders a square, icon-only button. Provide an accessible name with
   * `aria-label`, or use `IconButton` which requires one.
   */
  iconOnly?: boolean;
}

const iconSizeByButtonSize: Record<ButtonSize, IconSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
};

/** Native button with token-driven variants, sizes, icons, and loading state. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    type = 'button',
    leftIcon,
    rightIcon,
    loading = false,
    fullWidth = false,
    iconOnly = false,
    className,
    children,
    disabled,
    ...rest
  },
  ref,
) {
  const iconSize = iconSizeByButtonSize[size];
  const leading = loading ? (
    <Icon icon={LoaderCircle} size={iconSize} className={styles.spinner} />
  ) : leftIcon ? (
    <Icon icon={leftIcon} size={iconSize} />
  ) : null;

  return (
    <button
      ref={ref}
      {...rest}
      type={type}
      className={cx(styles.button, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      data-icon-only={iconOnly || undefined}
      data-full-width={fullWidth || undefined}
    >
      {iconOnly ? (
        <>
          {leading}
          {children}
        </>
      ) : (
        <>
          {leading}
          {children}
          {!loading && rightIcon ? <Icon icon={rightIcon} size={iconSize} /> : null}
        </>
      )}
    </button>
  );
});
