import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react';

import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../types';
import styles from './text.module.css';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextWeight = 'regular' | 'medium' | 'semibold';
export type TextTone = 'default' | 'muted' | 'subtle' | 'inherit' | 'accent' | 'success' | 'danger';
export type TextAlign = 'start' | 'center' | 'end' | 'justify';

export interface TextOwnProps {
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  align?: TextAlign;
  /** Truncates content on a single line with an ellipsis. */
  truncate?: boolean;
}

export type TextProps<T extends ElementType = 'span'> = PolymorphicProps<T, TextOwnProps>;

function TextImpl(
  {
    as,
    className,
    size = 'md',
    weight = 'regular',
    tone = 'default',
    align = 'start',
    truncate = false,
    ...rest
  }: TextProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'span') as ElementType;

  return (
    <Component
      ref={ref}
      {...rest}
      className={cx(styles.text, className)}
      data-size={size}
      data-weight={weight}
      data-tone={tone}
      data-align={align}
      data-truncate={truncate || undefined}
    />
  );
}

TextImpl.displayName = 'Text';

/** Typographic primitive with a small, token-driven set of text styles. */
export const Text = forwardRef(TextImpl) as <T extends ElementType = 'span'>(
  props: TextProps<T>,
) => ReactElement | null;
