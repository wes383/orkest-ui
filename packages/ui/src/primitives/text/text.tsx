import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
} from 'react';

import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../types';
import styles from './text.module.css';

export type TextSize =
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | 'inherit';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextTone = 'default' | 'muted' | 'subtle' | 'inherit' | 'accent' | 'success' | 'danger';
export type TextAlign = 'start' | 'center' | 'end' | 'justify';
export type TextFont = 'sans' | 'display' | 'mono' | 'numeric';
export type TextLineHeight = 'tight' | 'snug' | 'normal' | 'relaxed';
export type TextLetterSpacing = 'tighter' | 'tight' | 'normal' | 'wide';

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
  lineHeight?: TextLineHeight;
  letterSpacing?: TextLetterSpacing;
  /** Truncates content on a single line with an ellipsis and block layout. */
  truncate?: boolean;
  /** Clamps content to the given number of lines. Takes precedence over `truncate`. */
  lineClamp?: number;
  italic?: boolean;
  underline?: boolean;
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
    lineHeight,
    letterSpacing,
    truncate = false,
    lineClamp,
    italic = false,
    underline = false,
    style,
    ...rest
  }: TextProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'span') as ElementType;
  const mergedStyle: CSSProperties | undefined = lineClamp
    ? { ...style, WebkitLineClamp: lineClamp }
    : style;

  return (
    <Component
      ref={ref}
      {...rest}
      className={cx(styles.text, className)}
      style={mergedStyle}
      data-size={size}
      data-weight={weight}
      data-tone={tone}
      data-align={align}
      data-font={font}
      data-line-height={lineHeight}
      data-letter-spacing={letterSpacing}
      data-truncate={truncate && lineClamp === undefined ? true : undefined}
      data-line-clamp={lineClamp ? true : undefined}
      data-italic={italic || undefined}
      data-underline={underline || undefined}
    />
  );
}

TextImpl.displayName = 'Text';

/** Typographic primitive with a token-driven set of text styles. */
export const Text = forwardRef(TextImpl) as <T extends ElementType = 'span'>(
  props: TextProps<T>,
) => ReactElement | null;
