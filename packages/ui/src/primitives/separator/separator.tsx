import { forwardRef, type HTMLAttributes } from 'react';

import { cx } from '../../utils/cx';
import styles from './separator.module.css';

export type SeparatorOrientation = 'horizontal' | 'vertical';
export type SeparatorVariant = 'solid' | 'dashed' | 'dotted';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Separator direction. Defaults to `horizontal`. */
  orientation?: SeparatorOrientation;
  /**
   * Treats the separator as purely visual. Defaults to `true`, which hides it
   * from assistive technology. Set to `false` when the break is meaningful.
   */
  decorative?: boolean;
  /** Line style. Defaults to `solid`. */
  variant?: SeparatorVariant;
}

/** Horizontal or vertical divider with explicit decorative or separator semantics. */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', decorative = true, variant = 'solid', className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      {...rest}
      role={decorative ? undefined : 'separator'}
      aria-hidden={decorative ? true : undefined}
      aria-orientation={decorative ? undefined : orientation}
      className={cx(styles.separator, className)}
      data-orientation={orientation}
      data-variant={variant}
    />
  );
});
