import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react';

import { Text, type TextOwnProps } from '../../primitives/text';
import type { PolymorphicProps } from '../../primitives/types';

export type SmallProps<T extends ElementType = 'small'> = PolymorphicProps<T, TextOwnProps>;

function SmallImpl(
  { as, size = 'sm', tone = 'inherit', ...rest }: SmallProps<'small'>,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'small') as ElementType;

  return <Text ref={ref} as={Component} size={size} tone={tone} {...rest} />;
}

SmallImpl.displayName = 'Small';

/** Small body text that inherits the surrounding color. */
export const Small = forwardRef(SmallImpl) as <T extends ElementType = 'small'>(
  props: SmallProps<T>,
) => ReactElement | null;
