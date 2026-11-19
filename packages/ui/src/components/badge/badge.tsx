import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import styles from '../../styles/chip.module.css';

export type BadgeVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'rounded' | 'pill';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  /** Decorative Lucide icon rendered before the content. */
  leftIcon?: LucideIcon;
  /** Decorative Lucide icon rendered after the content. */
  rightIcon?: LucideIcon;
  /** Shows a leading status dot. With no content, renders a standalone dot. */
  dot?: boolean;
  /** Count value. Takes precedence over children. */
  count?: number;
  /** Maximum count before rendering `maxCount+`. Defaults to 99. */
  maxCount?: number;
  /** Tints the badge with a custom CSS color. */
  color?: string;
}

const iconSizeByBadgeSize: Record<BadgeSize, IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
};

type BadgeStyle = CSSProperties & {
  '--chip-custom-color'?: string;
};

/** Static status, count, or metadata label. Use Tag for removable or clickable chips. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant = 'default',
    size = 'md',
    shape = 'rounded',
    leftIcon,
    rightIcon,
    dot = false,
    count,
    maxCount = 99,
    color,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const iconSize = iconSizeByBadgeSize[size];
  const countText =
    count === undefined ? undefined : count > maxCount ? `${maxCount}+` : String(count);
  const hasContent =
    countText !== undefined || (children !== undefined && children !== null && children !== false);
  const dotOnly = dot && !hasContent && !leftIcon && !rightIcon;
  const mergedStyle: BadgeStyle | undefined = color
    ? { ...style, '--chip-custom-color': color }
    : style;

  return (
    <span
      ref={ref}
      {...rest}
      className={cx(styles.chip, className)}
      style={mergedStyle}
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      data-dot-only={dotOnly || undefined}
      data-custom={color ? true : undefined}
    >
      {dotOnly ? (
        <span className={styles.dot} data-dot="true" aria-hidden="true" />
      ) : (
        <>
          {dot ? <span className={styles.dot} data-dot="true" aria-hidden="true" /> : null}
          {leftIcon ? <Icon icon={leftIcon} size={iconSize} /> : null}
          {countText ?? children}
          {rightIcon ? <Icon icon={rightIcon} size={iconSize} /> : null}
        </>
      )}
    </span>
  );
});
