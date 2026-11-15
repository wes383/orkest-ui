import {
  forwardRef,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
} from 'react';

import { cx } from '../../utils/cx';
import { mergeStyles, sizeValue, spaceValue, type SpaceStep } from '../layout';
import type { PolymorphicProps } from '../types';
import styles from './box.module.css';

export type BoxDimension = number | string;
export type BoxPadding = SpaceStep;
export type BoxBackground =
  | 'transparent'
  | 'background'
  | 'surface'
  | 'surface-raised'
  | 'surface-sunken'
  | 'secondary'
  | 'accent-surface'
  | 'success-surface'
  | 'warning-surface'
  | 'danger-surface';
export type BoxColor =
  | 'inherit'
  | 'foreground'
  | 'muted'
  | 'subtle'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'primary-foreground'
  | 'secondary-foreground';
export type BoxBorder = boolean | 'subtle' | 'default' | 'strong';
export type BoxRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type BoxShadow = 'xs' | 'sm' | 'md' | 'lg';
export type BoxOverflow = 'visible' | 'hidden' | 'auto' | 'scroll' | 'clip';

const backgroundValues: Record<BoxBackground, string> = {
  transparent: 'transparent',
  background: 'var(--ui-background)',
  surface: 'var(--ui-surface)',
  'surface-raised': 'var(--ui-surface-raised)',
  'surface-sunken': 'var(--ui-surface-sunken)',
  secondary: 'var(--ui-secondary)',
  'accent-surface': 'var(--ui-accent-surface)',
  'success-surface': 'var(--ui-success-surface)',
  'warning-surface': 'var(--ui-warning-surface)',
  'danger-surface': 'var(--ui-danger-surface)',
};

const colorValues: Record<BoxColor, string> = {
  inherit: 'inherit',
  foreground: 'var(--ui-foreground)',
  muted: 'var(--ui-muted-foreground)',
  subtle: 'var(--ui-subtle-foreground)',
  accent: 'var(--ui-accent)',
  success: 'var(--ui-success)',
  warning: 'var(--ui-warning)',
  danger: 'var(--ui-danger)',
  'primary-foreground': 'var(--ui-primary-foreground)',
  'secondary-foreground': 'var(--ui-secondary-foreground)',
};

const borderValues: Record<Exclude<BoxBorder, boolean>, string> = {
  subtle: 'var(--ui-border-subtle)',
  default: 'var(--ui-border)',
  strong: 'var(--ui-border-strong)',
};

function resolveBorderColor(border: BoxBorder | undefined): string | undefined {
  if (border === undefined || border === false) {
    return undefined;
  }

  return border === true ? borderValues.default : borderValues[border];
}

export interface BoxOwnProps {
  /** Width. Numbers are treated as pixels. */
  width?: BoxDimension;
  /** Height. Numbers are treated as pixels. */
  height?: BoxDimension;
  minWidth?: BoxDimension;
  maxWidth?: BoxDimension;
  minHeight?: BoxDimension;
  maxHeight?: BoxDimension;
  /** Padding as a spacing token step. */
  padding?: BoxPadding;
  /** Semantic background token. */
  background?: BoxBackground;
  /** Semantic text color token. */
  color?: BoxColor;
  /** Border weight. `true` uses the default border color. */
  border?: BoxBorder;
  /** Corner radius token. */
  radius?: BoxRadius;
  /** Shadow token. */
  shadow?: BoxShadow;
  /** CSS overflow behavior. */
  overflow?: BoxOverflow;
}

export type BoxProps<T extends ElementType = 'div'> = PolymorphicProps<T, BoxOwnProps>;

function BoxImpl(
  {
    as,
    className,
    style,
    width,
    height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    padding,
    background,
    color,
    border,
    radius,
    shadow,
    overflow,
    ...rest
  }: BoxProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'div') as ElementType;
  const borderColor = resolveBorderColor(border);
  const layoutStyle = mergeStyles(
    width === undefined ? undefined : { width: sizeValue(width) },
    height === undefined ? undefined : { height: sizeValue(height) },
    minWidth === undefined ? undefined : { minWidth: sizeValue(minWidth) },
    maxWidth === undefined ? undefined : { maxWidth: sizeValue(maxWidth) },
    minHeight === undefined ? undefined : { minHeight: sizeValue(minHeight) },
    maxHeight === undefined ? undefined : { maxHeight: sizeValue(maxHeight) },
    padding === undefined ? undefined : { padding: spaceValue(padding) },
    background === undefined ? undefined : { background: backgroundValues[background] },
    color === undefined ? undefined : { color: colorValues[color] },
    borderColor === undefined
      ? undefined
      : {
          borderWidth: 'var(--ok-border-width)',
          borderStyle: 'solid',
          borderColor,
        },
    radius === undefined ? undefined : { borderRadius: `var(--ok-radius-${radius})` },
    shadow === undefined ? undefined : { boxShadow: `var(--ok-shadow-${shadow})` },
    overflow === undefined ? undefined : { overflow },
    style,
  );

  return (
    <Component
      ref={ref}
      {...rest}
      className={cx(styles.box, className)}
      style={layoutStyle}
    />
  );
}

BoxImpl.displayName = 'Box';

/**
 * Token-aware container for semantic composition. Use Stack or Grid for
 * child arrangement and Card when the surface has card semantics.
 */
export const Box = forwardRef(BoxImpl) as <T extends ElementType = 'div'>(
  props: BoxProps<T>,
) => ReactElement | null;
