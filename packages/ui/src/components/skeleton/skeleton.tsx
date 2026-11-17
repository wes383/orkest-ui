import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

import { cx } from '../../utils/cx';

import styles from './skeleton.module.css';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Shape of the placeholder. Defaults to `text`. */
  variant?: SkeletonVariant;
  /** Width in CSS units. Numbers are treated as pixels. */
  width?: number | string;
  /** Height in CSS units. Numbers are treated as pixels. */
  height?: number | string;
  /** Corner radius in CSS units. Numbers are treated as pixels. */
  radius?: number | string;
  /** Animation applied to the placeholder. Defaults to `pulse`. */
  animation?: SkeletonAnimation;
}

type SkeletonStyle = CSSProperties & {
  '--skeleton-width'?: string;
  '--skeleton-height'?: string;
  '--skeleton-radius'?: string;
};

function toLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Placeholder that mimics content while it loads. It renders no text and is
 * hidden from assistive technology by default, so compose several instances
 * instead of asking the component to model a layout.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, radius, animation = 'pulse', className, style, ...rest },
  ref,
) {
  const mergedStyle: SkeletonStyle = { ...style };

  if (width !== undefined) {
    mergedStyle['--skeleton-width'] = toLength(width);
  }

  if (height !== undefined) {
    mergedStyle['--skeleton-height'] = toLength(height);
  }

  if (radius !== undefined) {
    mergedStyle['--skeleton-radius'] = toLength(radius);
  }

  return (
    <span
      ref={ref}
      className={cx(styles.root, className)}
      style={mergedStyle}
      data-variant={variant}
      data-animation={animation}
      aria-hidden="true"
      {...rest}
    />
  );
});
