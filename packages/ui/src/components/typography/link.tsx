import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react';

import { Text, type TextOwnProps } from '../../primitives/text';
import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../../primitives/types';
import styles from './typography.module.css';

export type LinkProps<T extends ElementType = 'a'> = PolymorphicProps<T, TextOwnProps>;

function LinkImpl(
  { as, className, size = 'inherit', tone = 'accent', underline = true, ...rest }: LinkProps<'a'>,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'a') as ElementType;

  return (
    <Text
      ref={ref}
      as={Component}
      className={cx(styles.link, className)}
      size={size}
      tone={tone}
      underline={underline}
      {...rest}
    />
  );
}

LinkImpl.displayName = 'Link';

/** Text link with accent color and a persistent underline. */
export const Link = forwardRef(LinkImpl) as <T extends ElementType = 'a'>(
  props: LinkProps<T>,
) => ReactElement | null;
