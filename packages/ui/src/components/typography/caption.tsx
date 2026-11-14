import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react';

import { Text, type TextOwnProps } from '../../primitives/text';
import type { PolymorphicProps } from '../../primitives/types';

export type CaptionProps<T extends ElementType = 'span'> = PolymorphicProps<T, TextOwnProps>;

function CaptionImpl(
  { as, size = 'xs', tone = 'muted', ...rest }: CaptionProps<'span'>,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'span') as ElementType;

  return <Text ref={ref} as={Component} size={size} tone={tone} {...rest} />;
}

CaptionImpl.displayName = 'Caption';

/** Small, muted supporting text for captions and helper copy. */
export const Caption = forwardRef(CaptionImpl) as <T extends ElementType = 'span'>(
  props: CaptionProps<T>,
) => ReactElement | null;
