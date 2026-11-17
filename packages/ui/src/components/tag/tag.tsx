import {
  forwardRef,
  type CSSProperties,
  type ForwardedRef,
  type HTMLAttributes,
} from 'react';
import { X, type LucideIcon } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import type { BadgeShape, BadgeSize, BadgeVariant } from '../badge';
import styles from '../../styles/chip.module.css';

export type TagVariant = BadgeVariant;
export type TagSize = BadgeSize;
export type TagShape = BadgeShape;

export interface TagProps extends HTMLAttributes<HTMLElement> {
  variant?: TagVariant;
  size?: TagSize;
  shape?: TagShape;
  /** Decorative Lucide icon rendered before the content. */
  leftIcon?: LucideIcon;
  /** Decorative Lucide icon rendered after the content. */
  rightIcon?: LucideIcon;
  /** Tints the tag with a custom CSS color. */
  color?: string;
  /** Shows a remove action. Removable tags render as a span, not a button. */
  removable?: boolean;
  onRemove?: () => void;
  /** Accessible name for the remove action. */
  removeLabel?: string;
  /** Renders a native button. Ignored when removable is set. */
  interactive?: boolean;
  /** Disabled state for interactive tags and their remove action. */
  disabled?: boolean;
}

const iconSizeByTagSize: Record<TagSize, IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
};

type TagStyle = CSSProperties & {
  '--chip-custom-color'?: string;
};

/** Removable or clickable chip. Use Badge for static status and count labels. */
export const Tag = forwardRef<HTMLSpanElement | HTMLButtonElement, TagProps>(function Tag(
  {
    variant = 'default',
    size = 'md',
    shape = 'pill',
    leftIcon,
    rightIcon,
    color,
    removable = false,
    onRemove,
    removeLabel = 'Remove',
    interactive = false,
    disabled = false,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const iconSize = iconSizeByTagSize[size];
  const isInteractive = interactive && !removable;
  const mergedStyle: TagStyle | undefined = color
    ? { ...style, '--chip-custom-color': color }
    : style;

  const content = (
    <>
      {leftIcon ? <Icon icon={leftIcon} size={iconSize} /> : null}
      {children}
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
    className: cx(styles.chip, className),
    style: mergedStyle,
    'data-variant': variant,
    'data-size': size,
    'data-shape': shape,
    'data-custom': color ? true : undefined,
    'data-removable': removable || undefined,
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
});
