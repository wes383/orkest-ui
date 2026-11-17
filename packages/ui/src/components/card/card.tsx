import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactElement,
} from 'react';

import type { PolymorphicProps } from '../../primitives/types';
import { cx } from '../../utils/cx';

import styles from './card.module.css';

export type CardVariant = 'default' | 'elevated' | 'outline';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg';
export type CardTitleLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface CardOwnProps {
  /** Surface treatment. Defaults to `default`, a bordered card on the page surface. */
  variant?: CardVariant;
  /** Inner spacing shared by every part. Defaults to `md`. */
  padding?: CardPadding;
  /** Corner radius in CSS units. Numbers are treated as pixels. */
  radius?: number | string;
  /** Elevation override. Defaults to `md` for `elevated` and `none` otherwise. */
  shadow?: CardShadow;
}

export type CardProps<T extends ElementType = 'div'> = PolymorphicProps<T, CardOwnProps>;

type CardStyle = CSSProperties & {
  '--card-radius'?: string;
};

const shadowByVariant: Record<CardVariant, CardShadow> = {
  default: 'none',
  elevated: 'md',
  outline: 'none',
};

function toLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Container that groups related content into one visual region. It only owns
 * surface, radius, and spacing; composition is handled by the parts. Render it
 * as `a` or `button` when the whole card is an action.
 */
function CardImpl(
  {
    as,
    variant = 'default',
    padding = 'md',
    radius,
    shadow,
    className,
    style,
    ...rest
  }: CardProps<'div'>,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'div') as ElementType;
  const mergedStyle: CardStyle = { ...style };

  if (radius !== undefined) {
    mergedStyle['--card-radius'] = toLength(radius);
  }

  return (
    <Component
      ref={ref}
      className={cx(styles.card, className)}
      style={mergedStyle}
      data-variant={variant}
      data-padding={padding}
      data-shadow={shadow ?? shadowByVariant[variant]}
      {...rest}
    />
  );
}

CardImpl.displayName = 'Card';

export const Card = forwardRef(CardImpl) as <T extends ElementType = 'div'>(
  props: CardProps<T>,
) => ReactElement | null;

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

/** Groups the title and description above the content. */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx(styles.header, className)} {...rest} />;
});

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level, which sets the rendered element. Defaults to `3`. */
  level?: CardTitleLevel;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { level = 3, className, ...rest },
  ref,
) {
  const Component = `h${level}` as ElementType;

  return <Component ref={ref} className={cx(styles.title, className)} {...rest} />;
});

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

/** Supporting sentence placed under the title. */
export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, ...rest }, ref) {
    return <p ref={ref} className={cx(styles.description, className)} {...rest} />;
  },
);

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

/** Main region of the card. Accepts any content. */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx(styles.content, className)} {...rest} />;
});

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

/** Trailing region for actions and metadata. */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx(styles.footer, className)} {...rest} />;
});

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Media region that bleeds to the card edges. The card clips it to the rounded
 * corners, so images do not need their own radius.
 */
export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(function CardMedia(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx(styles.media, className)} {...rest} />;
});
