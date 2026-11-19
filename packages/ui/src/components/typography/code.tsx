import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react';

import { Text, type TextOwnProps } from '../../primitives/text';
import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../../primitives/types';
import styles from './typography.module.css';

export type CodeProps<T extends ElementType = 'code'> = PolymorphicProps<T, TextOwnProps>;

function CodeImpl(
  { as, className, size = 'inherit', font = 'mono', tone = 'inherit', ...rest }: CodeProps<'code'>,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'code') as ElementType;

  return (
    <Text
      ref={ref}
      as={Component}
      className={cx(styles.code, className)}
      size={size}
      font={font}
      tone={tone}
      {...rest}
    />
  );
}

CodeImpl.displayName = 'Code';

/** Inline code with a monospace face and a subtle token surface. */
export const Code = forwardRef(CodeImpl) as <T extends ElementType = 'code'>(
  props: CodeProps<T>,
) => ReactElement | null;
