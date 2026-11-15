import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react';

import { cx } from '../../utils/cx';
import type { SpaceStep } from '../layout';
import type { PolymorphicProps } from '../types';
import styles from './stack.module.css';

export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type StackGap = SpaceStep;

export interface StackOwnProps {
  /** Main axis. Defaults to `column`. */
  direction?: StackDirection;
  /** Spacing token step, e.g. `4` resolves to `--ok-space-4` (16px). */
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
}

export type StackProps<T extends ElementType = 'div'> = PolymorphicProps<T, StackOwnProps>;

function StackImpl(
  {
    as,
    className,
    direction = 'column',
    gap = 2,
    align = 'stretch',
    justify = 'start',
    wrap = false,
    ...rest
  }: StackProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'div') as ElementType;

  return (
    <Component
      ref={ref}
      {...rest}
      className={cx(styles.stack, className)}
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap || undefined}
    />
  );
}

StackImpl.displayName = 'Stack';

/** One-dimensional flex layout primitive for consistent vertical or horizontal rhythm. */
export const Stack = forwardRef(StackImpl) as <T extends ElementType = 'div'>(
  props: StackProps<T>,
) => ReactElement | null;
