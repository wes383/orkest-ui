import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react';

import { Text, type TextOwnProps } from '../../primitives/text';
import type { PolymorphicProps } from '../../primitives/types';

export type ParagraphProps<T extends ElementType = 'p'> = PolymorphicProps<T, TextOwnProps>;

function ParagraphImpl(
  { as, size = 'md', lineHeight = 'relaxed', ...rest }: ParagraphProps<'p'>,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'p') as ElementType;

  return <Text ref={ref} as={Component} size={size} lineHeight={lineHeight} {...rest} />;
}

ParagraphImpl.displayName = 'Paragraph';

/** Body paragraph with comfortable line height. */
export const Paragraph = forwardRef(ParagraphImpl) as <T extends ElementType = 'p'>(
  props: ParagraphProps<T>,
) => ReactElement | null;
