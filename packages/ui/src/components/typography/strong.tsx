import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react';

import { Text, type TextOwnProps } from '../../primitives/text';
import type { PolymorphicProps } from '../../primitives/types';

export type StrongProps<T extends ElementType = 'strong'> = PolymorphicProps<T, TextOwnProps>;

function StrongImpl(
  { as, size = 'inherit', weight = 'semibold', tone = 'inherit', ...rest }: StrongProps<'strong'>,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'strong') as ElementType;

  return <Text ref={ref} as={Component} size={size} weight={weight} tone={tone} {...rest} />;
}

StrongImpl.displayName = 'Strong';

/** Strong emphasis that inherits the surrounding size and color. */
export const Strong = forwardRef(StrongImpl) as <T extends ElementType = 'strong'>(
  props: StrongProps<T>,
) => ReactElement | null;
