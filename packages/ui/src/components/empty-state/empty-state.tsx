import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { cx } from '../../utils/cx';
import { Icon } from '../../primitives/icon';

import styles from './empty-state.module.css';

export type EmptyStateSize = 'sm' | 'md' | 'lg';
export type EmptyStateAlign = 'center' | 'start';
export type EmptyStateTitleLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Space around the content. Defaults to `md`. */
  size?: EmptyStateSize;
  /** Content alignment. Defaults to `center`. */
  align?: EmptyStateAlign;
  /** Shorthand for `EmptyStateTitle`. */
  title?: ReactNode;
  /** Shorthand for `EmptyStateDescription`. */
  description?: ReactNode;
  /** Shorthand for `EmptyStateIcon`. An icon is enough for most cases. */
  icon?: LucideIcon;
  /** Optional illustration. Takes precedence over `icon`. */
  image?: { src: string; alt: string };
  /** Shorthand for `EmptyStateAction`, usually one or two buttons. */
  action?: ReactNode;
  /** Custom composition built from the parts. Replaces the shorthand content. */
  children?: ReactNode;
}

/**
 * Placeholder for a region with nothing to show yet. It is purely presentational:
 * use it for empty collections, unset filters, and first-run states — not for
 * loading (use Skeleton) or failures (use an error state with a retry action).
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { size = 'md', align = 'center', title, description, icon, image, action, children, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(styles.root, className)}
      data-size={size}
      data-align={align}
      {...rest}
    >
      {children ?? (
        <>
          {image ? (
            <img className={styles.image} src={image.src} alt={image.alt} />
          ) : icon ? (
            <EmptyStateIcon icon={icon} />
          ) : null}

          {title ? <EmptyStateTitle>{title}</EmptyStateTitle> : null}
          {description ? <EmptyStateDescription>{description}</EmptyStateDescription> : null}
          {action ? <EmptyStateAction>{action}</EmptyStateAction> : null}
        </>
      )}
    </div>
  );
});

export interface EmptyStateIconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Decorative icon rendered inside the surface. */
  icon?: LucideIcon;
}

/** Visual anchor for the state: one icon, or any custom node. */
export const EmptyStateIcon = forwardRef<HTMLSpanElement, EmptyStateIconProps>(
  function EmptyStateIcon({ icon, className, children, ...rest }, ref) {
    return (
      <span ref={ref} className={cx(styles.icon, className)} {...rest}>
        {children ?? (icon ? <Icon icon={icon} size="inherit" tone="muted" /> : null)}
      </span>
    );
  },
);

export interface EmptyStateTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level, which sets the rendered element. Defaults to `3`. */
  level?: EmptyStateTitleLevel;
}

export const EmptyStateTitle = forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(
  function EmptyStateTitle({ level = 3, className, ...rest }, ref) {
    const Component = `h${level}` as ElementType;

    return <Component ref={ref} className={cx(styles.title, className)} {...rest} />;
  },
);

export interface EmptyStateDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const EmptyStateDescription = forwardRef<HTMLParagraphElement, EmptyStateDescriptionProps>(
  function EmptyStateDescription({ className, ...rest }, ref) {
    return <p ref={ref} className={cx(styles.description, className)} {...rest} />;
  },
);

export interface EmptyStateActionProps extends HTMLAttributes<HTMLDivElement> {}

/** Holds the actions for the state. It is omitted when there is nothing to do. */
export const EmptyStateAction = forwardRef<HTMLDivElement, EmptyStateActionProps>(
  function EmptyStateAction({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(styles.action, className)} {...rest} />;
  },
);
