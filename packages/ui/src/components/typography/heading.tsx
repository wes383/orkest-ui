import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react';

import { Text, type TextOwnProps, type TextSize } from '../../primitives/text';
import type { PolymorphicProps } from '../../primitives/types';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingOwnProps extends TextOwnProps {
  /** Semantic heading level. Defaults to `2`. */
  level?: HeadingLevel;
}

export type HeadingProps<T extends ElementType = 'h2'> = PolymorphicProps<T, HeadingOwnProps>;

const headingSizeByLevel: Record<HeadingLevel, TextSize> = {
  1: '5xl',
  2: '4xl',
  3: '3xl',
  4: '2xl',
  5: 'xl',
  6: 'lg',
};

function HeadingImpl(
  {
    as,
    level = 2,
    size,
    weight = 'semibold',
    font = 'sans',
    lineHeight = 'tight',
    letterSpacing = 'tighter',
    ...rest
  }: HeadingProps<'h2'>,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? `h${level}`) as ElementType;

  return (
    <Text
      ref={ref}
      as={Component}
      size={size ?? headingSizeByLevel[level]}
      weight={weight}
      font={font}
      lineHeight={lineHeight}
      letterSpacing={letterSpacing}
      {...rest}
    />
  );
}

HeadingImpl.displayName = 'Heading';

/**
 * Semantic heading with a level-driven type scale. `level` sets both the
 * rendered element and the default size; `as` and `size` decouple them.
 */
export const Heading = forwardRef(HeadingImpl) as <T extends ElementType = 'h2'>(
  props: HeadingProps<T>,
) => ReactElement | null;
