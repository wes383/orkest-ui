import {
  forwardRef,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
} from 'react';

import { cx } from '../../utils/cx';
import {
  mergeStyles,
  responsiveStyle,
  spaceValue,
  type ResponsiveValue,
  type SpaceStep,
} from '../layout';
import type { PolymorphicProps } from '../types';
import styles from './grid.module.css';

export type GridColumns = number | string;
export type GridRows = number | string;
export type GridGap = SpaceStep;
export type GridAlign = 'start' | 'center' | 'end' | 'stretch';
export type GridJustify = 'start' | 'center' | 'end' | 'stretch';
export type GridAutoFlow = 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
export type GridResponsiveValue<T> = ResponsiveValue<T>;

function gridTrackValue(value: GridColumns): string {
  return typeof value === 'number' ? `repeat(${value}, minmax(0, 1fr))` : value;
}

export interface GridOwnProps {
  /** Column count or any valid `grid-template-columns` value. Supports responsive values. */
  columns?: GridResponsiveValue<GridColumns>;
  /** Row count or any valid `grid-template-rows` value. Supports responsive values. */
  rows?: GridResponsiveValue<GridRows>;
  /** Row and column gap as a spacing token step. Supports responsive values. */
  gap?: GridResponsiveValue<GridGap>;
  /** Column gap as a spacing token step. Falls back to `gap`. */
  columnGap?: GridResponsiveValue<GridGap>;
  /** Row gap as a spacing token step. Falls back to `gap`. */
  rowGap?: GridResponsiveValue<GridGap>;
  /** CSS `grid-auto-flow` behavior. */
  autoFlow?: GridAutoFlow;
  /** Vertical alignment of grid items. Defaults to `stretch`. */
  align?: GridAlign;
  /** Horizontal alignment of grid items. Defaults to `stretch`. */
  justify?: GridJustify;
}

export type GridProps<T extends ElementType = 'div'> = PolymorphicProps<T, GridOwnProps>;

function GridImpl(
  {
    as,
    className,
    style,
    columns,
    rows,
    gap,
    columnGap,
    rowGap,
    autoFlow,
    align,
    justify,
    ...rest
  }: GridProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'div') as ElementType;
  const layoutStyle = mergeStyles(
    responsiveStyle('grid-columns', columns, gridTrackValue),
    responsiveStyle('grid-rows', rows, gridTrackValue),
    responsiveStyle('grid-gap', gap, spaceValue),
    responsiveStyle('grid-column-gap', columnGap, spaceValue),
    responsiveStyle('grid-row-gap', rowGap, spaceValue),
    style,
  );

  return (
    <Component
      ref={ref}
      {...rest}
      className={cx(styles.grid, className)}
      style={layoutStyle}
      data-auto-flow={autoFlow}
      data-align={align}
      data-justify={justify}
    />
  );
}

GridImpl.displayName = 'Grid';

/** Two-dimensional CSS Grid layout with token gaps and responsive column values. */
export const Grid = forwardRef(GridImpl) as <T extends ElementType = 'div'>(
  props: GridProps<T>,
) => ReactElement | null;
