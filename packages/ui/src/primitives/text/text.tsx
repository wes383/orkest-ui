import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react';

import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../types';
import styles from './text.module.css';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextWeight = 'regular' | 'medium' | 'semibold';
export type TextTone = 'default' | 'muted' | 'subtle' | 'inherit' | 'accent' | 'success' | 'danger';
export type TextAlign = 'start' | 'center' | 'end' | 'justify';
export type TextFont = 'sans' | 'display' | 'mono' | 'numeric';

export interface TextOwnProps {
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  align?: TextAlign;
  /**
   * `display` opts into the large-heading face; `mono` is intended for code;
   * `numeric` keeps Inter but enables tabular figures so digits align.
   */
  font?: TextFont;
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
    font = 'sans',
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
      data-font={font}
      data-truncate={truncate || undefined}
    />
  );
}

TextImpl.displayName = 'Text';

/** Typographic primitive with a small, token-driven set of text styles. */
export const Text = forwardRef(TextImpl) as <T extends ElementType = 'span'>(
  props: TextProps<T>,
) => ReactElement | null;
