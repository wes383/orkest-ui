import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from 'react';
import type { LucideIcon } from 'lucide-react';

import { cx } from '../../utils/cx';
import styles from './icon.module.css';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'inherit';
export type IconTone = 'default' | 'muted' | 'subtle' | 'inherit' | 'accent' | 'success' | 'danger';

export interface IconProps extends Omit<
  ComponentPropsWithoutRef<'svg'>,
  'children' | 'width' | 'height' | 'strokeWidth'
> {
  /** A Lucide icon component, e.g. `import { Check } from 'lucide-react'`. */
  icon: LucideIcon;
  /** Icon size. `inherit` matches the surrounding font size. */
  size?: IconSize;
  /**
   * Semantic color. Defaults to `inherit` so icons follow the foreground of
   * the control they are placed in, such as Button or Input.
   */
  tone?: IconTone;
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
  { icon: Glyph, size = 'md', tone = 'inherit', label, className, style, strokeWidth, ...rest },
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
      data-tone={tone}
      style={mergedStyle}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      focusable={label ? undefined : false}
    />
  );
});
