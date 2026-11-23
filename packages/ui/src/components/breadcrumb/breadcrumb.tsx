import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes } from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { cx } from '../../utils/cx';

import styles from './breadcrumb.module.css';

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name for the navigation landmark. Defaults to `Breadcrumb`. */
  label?: string;
}

/** Navigation landmark that wraps the trail. */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { label = 'Breadcrumb', className, ...rest },
  ref,
) {
  return <nav ref={ref} aria-label={label} className={cx(styles.root, className)} {...rest} />;
});

export interface BreadcrumbListProps extends HTMLAttributes<HTMLOListElement> {}

/** Ordered list of trail entries. */
export const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  function BreadcrumbList({ className, ...rest }, ref) {
    return <ol ref={ref} className={cx(styles.list, className)} {...rest} />;
  },
);

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLLIElement> {}

/** Single trail entry. Place a link, the current page, or an ellipsis inside it. */
export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem({ className, ...rest }, ref) {
    return <li ref={ref} className={cx(styles.item, className)} {...rest} />;
  },
);

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

/** Ancestor link. Use `BreadcrumbPage` for the current page instead. */
export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink({ className, children, ...rest }, ref) {
    return (
      <a ref={ref} className={cx(styles.link, className)} {...rest}>
        {children}
      </a>
    );
  },
);

export interface BreadcrumbPageProps extends HTMLAttributes<HTMLSpanElement> {}

/** Current page. It is plain text and deliberately not a link. */
export const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  function BreadcrumbPage({ className, ...rest }, ref) {
    return <span ref={ref} aria-current="page" className={cx(styles.page, className)} {...rest} />;
  },
);

export interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLLIElement> {}

/**
 * Visual divider between entries. It is decorative and hidden from assistive
 * technology; pass children to replace the default chevron.
 */
export const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  function BreadcrumbSeparator({ children, className, ...rest }, ref) {
    return (
      <li ref={ref} aria-hidden="true" className={cx(styles.separator, className)} {...rest}>
        {children ?? <Icon icon={ChevronRight} size="xs" />}
      </li>
    );
  },
);

export interface BreadcrumbEllipsisProps extends HTMLAttributes<HTMLSpanElement> {
  /** Text announced in place of the icon. Defaults to `More`. */
  label?: string;
}

/** Collapsed middle entries. Wrap it in `BreadcrumbItem` when it is a list child. */
export const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  function BreadcrumbEllipsis({ label = 'More', className, ...rest }, ref) {
    return (
      <span ref={ref} className={cx(styles.ellipsis, className)} {...rest}>
        <Icon icon={MoreHorizontal} size="xs" />
        <span className={styles.srOnly}>{label}</span>
      </span>
    );
  },
);
