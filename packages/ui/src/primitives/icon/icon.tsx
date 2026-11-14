import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from 'react';
import type { LucideIcon } from 'lucide-react';

import { cx } from '../../utils/cx';
import styles from './icon.module.css';

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps
  extends Omit<
    ComponentPropsWithoutRef<'svg'>,
    'children' | 'width' | 'height' | 'strokeWidth'
  > {
  /** A Lucide icon component, e.g. `import { Check } from 'lucide-react'`. */
  icon: LucideIcon;
  size?: IconSize;
  /**
   * Accessible name. When omitted the icon is treated as decorative and
   * hidden from assistive technology.
   */
  label?: string;
  /** Overrides the default icon stroke width token. */
  strokeWidth?: number;
}

type IconStyle = CSSProperties & {
  '--ok-icon-stroke-width'?: number;
};

/** Token-sized icon with the correct decorative or labelled accessibility semantics. */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { icon: Glyph, size = 'md', label, className, style, strokeWidth, ...rest },
  ref,
) {
  const mergedStyle: IconStyle | undefined =
    strokeWidth === undefined ? style : { ...style, '--ok-icon-stroke-width': strokeWidth };

  return (
    <Glyph
      ref={ref}
      {...rest}
      className={cx(styles.icon, className)}
      data-size={size}
      style={mergedStyle}
      {...(label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': true, focusable: false })}
    />
  );
});
