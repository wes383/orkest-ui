import {
  forwardRef,
  type CSSProperties,
  type ForwardedRef,
  type HTMLAttributes,
} from 'react';
import { X, type LucideIcon } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import styles from './badge.module.css';

export type BadgeVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'rounded' | 'pill';

export interface BadgeProps extends HTMLAttributes<HTMLElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  /** Decorative Lucide icon rendered before the content. */
  leftIcon?: LucideIcon;
  /** Decorative Lucide icon rendered after the content. */
  rightIcon?: LucideIcon;
  /** Shows a leading status dot. With no content, renders a standalone dot. */
  dot?: boolean;
  /** Shows a remove action. Removable badges render as a span, not a button. */
  removable?: boolean;
  onRemove?: () => void;
  /** Accessible name for the remove action. */
  removeLabel?: string;
  /** Count value. Takes precedence over children. */
  count?: number;
  /** Maximum count before rendering `maxCount+`. Defaults to 99. */
  maxCount?: number;
  /** Tints the badge with a custom CSS color. */
  color?: string;
  /** Renders a native button. Ignored when removable is set. */
  interactive?: boolean;
  /** Disabled state for interactive badges. */
  disabled?: boolean;
}

const iconSizeByBadgeSize: Record<BadgeSize, IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
};

type BadgeStyle = CSSProperties & {
  '--badge-custom-color'?: string;
};

/** Compact status, count, or tag label. */
export const Badge = forwardRef<HTMLSpanElement | HTMLButtonElement, BadgeProps>(
  function Badge(
    {
      variant = 'default',
      size = 'md',
      shape = 'rounded',
      leftIcon,
      rightIcon,
      dot = false,
      removable = false,
      onRemove,
      removeLabel = 'Remove',
      count,
      maxCount = 99,
      color,
      interactive = false,
      disabled = false,
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
      countText !== undefined ||
      (children !== undefined && children !== null && children !== false);
    const dotOnly = dot && !hasContent && !leftIcon && !rightIcon && !removable;
    const isInteractive = interactive && !removable;
    const mergedStyle: BadgeStyle | undefined = color
      ? { ...style, '--badge-custom-color': color }
      : style;

    const content = dotOnly ? (
      <span className={styles.dot} data-dot="true" aria-hidden="true" />
    ) : (
      <>
        {dot ? <span className={styles.dot} data-dot="true" aria-hidden="true" /> : null}
        {leftIcon ? <Icon icon={leftIcon} size={iconSize} /> : null}
        {countText ?? children}
        {rightIcon ? <Icon icon={rightIcon} size={iconSize} /> : null}
        {removable ? (
          <button
            type="button"
            className={styles.remove}
            aria-label={removeLabel}
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              onRemove?.();
            }}
          >
            <Icon icon={X} size={iconSize} />
          </button>
        ) : null}
      </>
    );

    const sharedProps = {
      className: cx(styles.badge, className),
      style: mergedStyle,
      'data-variant': variant,
      'data-size': size,
      'data-shape': shape,
      'data-dot-only': dotOnly || undefined,
      'data-custom': color ? true : undefined,
      'data-interactive': isInteractive || undefined,
    };

    if (isInteractive) {
      return (
        <button
          ref={ref as ForwardedRef<HTMLButtonElement>}
          type="button"
          disabled={disabled}
          {...rest}
          {...sharedProps}
        >
          {content}
        </button>
      );
    }

    return (
      <span ref={ref as ForwardedRef<HTMLSpanElement>} {...rest} {...sharedProps}>
        {content}
      </span>
    );
  },
);
