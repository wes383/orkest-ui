import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react';

import { Text, type TextOwnProps } from '../../primitives/text';
import type { PolymorphicProps } from '../../primitives/types';

export type LabelProps<T extends ElementType = 'label'> = PolymorphicProps<T, TextOwnProps>;

function LabelImpl(
  { as, size = 'sm', weight = 'medium', ...rest }: LabelProps<'label'>,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'label') as ElementType;

  return <Text ref={ref} as={Component} size={size} weight={weight} {...rest} />;
}

LabelImpl.displayName = 'Label';

/** Form label and compact field title. Pair with `htmlFor` or wrap the control. */
export const Label = forwardRef(LabelImpl) as <T extends ElementType = 'label'>(
  props: LabelProps<T>,
) => ReactElement | null;
