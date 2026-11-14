import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react';

import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../types';
import styles from './box.module.css';

export type BoxProps<T extends ElementType = 'div'> = PolymorphicProps<T>;

function BoxImpl({ as, className, ...rest }: BoxProps, ref: ForwardedRef<HTMLElement>) {
  const Component = (as ?? 'div') as ElementType;

  return <Component ref={ref} className={cx(styles.box, className)} {...rest} />;
}

BoxImpl.displayName = 'Box';

/**
 * Neutral, unstyled container used as the composition base for other
 * primitives. It intentionally exposes no layout props beyond `as`.
 */
export const Box = forwardRef(BoxImpl) as <T extends ElementType = 'div'>(
  props: BoxProps<T>,
) => ReactElement | null;
