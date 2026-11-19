import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { cx } from '../../utils/cx';
import { IconButton, type IconButtonProps } from '../icon-button';

import styles from './pagination.module.css';

export type PaginationSize = 'sm' | 'md' | 'lg';

/** A page number, or an ellipsis marking skipped pages. */
export type PaginationRangeItem = number | 'start-ellipsis' | 'end-ellipsis';

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(end - start + 1, 0) }, (_, index) => start + index);
}

export function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
}

/**
 * Visible page slots. Boundary pages stay visible, siblings follow the current
 * page, and one ellipsis stands in for each collapsed run.
 */
export function getPaginationRange(
  page: number,
  totalPages: number,
  siblingCount = 1,
): PaginationRangeItem[] {
  if (totalPages < 1) {
    return [];
  }

  const current = clampPage(page, totalPages);
  const siblings = Math.max(siblingCount, 0);
  const totalSlots = siblings * 2 + 5;

  if (totalPages <= totalSlots) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, totalPages);
  const showStartEllipsis = leftSibling > 2;
  const showEndEllipsis = rightSibling < totalPages - 1;
  const edgeCount = siblings * 2 + 3;

  if (!showStartEllipsis && showEndEllipsis) {
    return [...range(1, edgeCount), 'end-ellipsis', totalPages];
  }

  if (showStartEllipsis && !showEndEllipsis) {
    return [1, 'start-ellipsis', ...range(totalPages - edgeCount + 1, totalPages)];
  }

  return [1, 'start-ellipsis', ...range(leftSibling, rightSibling), 'end-ellipsis', totalPages];
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page, starting at `1`. Values outside the range are clamped. */
  page: number;
  /** Total number of pages. Renders nothing when it is `0`. */
  totalPages: number;
  /** Called with the requested page. */
  onPageChange: (page: number) => void;
  /** Pages rendered on each side of the current page. Defaults to `1`. */
  siblingCount?: number;
  /** Shows jump-to-first and jump-to-last buttons. Defaults to `false`. */
  showFirstLast?: boolean;
  /** Disables every control. */
  disabled?: boolean;
  /** Control size. Defaults to `md`. */
  size?: PaginationSize;
  /** Accessible name for the navigation landmark. Defaults to `Pagination`. */
  label?: string;
  /** Accessible names for the step and jump buttons. */
  previousLabel?: string;
  nextLabel?: string;
  firstLabel?: string;
  lastLabel?: string;
  /** Custom composition built from the Pagination parts. Replaces the page list. */
  children?: ReactNode;
}

/**
 * Pagination navigation. Renders the recommended page list by default and
 * accepts the parts as children when the shape needs to differ.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    totalPages,
    onPageChange,
    siblingCount = 1,
    showFirstLast = false,
    disabled = false,
    size = 'md',
    label = 'Pagination',
    previousLabel = 'Previous page',
    nextLabel = 'Next page',
    firstLabel = 'First page',
    lastLabel = 'Last page',
    children,
    className,
    ...rest
  },
  ref,
) {
  if (totalPages <= 1) {
    return null;
  }

  const currentPage = clampPage(page, totalPages);
  const items = getPaginationRange(currentPage, totalPages, siblingCount);
  const atStart = currentPage <= 1;
  const atEnd = currentPage >= totalPages;

  const goTo = (next: number) => {
    const target = clampPage(next, totalPages);

    if (target !== currentPage && !disabled) {
      onPageChange(target);
    }
  };

  return (
    <nav
      ref={ref}
      className={cx(styles.root, className)}
      aria-label={label}
      data-size={size}
      data-disabled={disabled || undefined}
      {...rest}
    >
      {children ?? (
        <PaginationContent>
          {showFirstLast ? (
            <PaginationItem>
              <IconButton
                icon={ChevronsLeft}
                label={firstLabel}
                size={size}
                variant="ghost"
                disabled={disabled || atStart}
                onClick={() => goTo(1)}
              />
            </PaginationItem>
          ) : null}

          <PaginationItem>
            <PaginationPrevious
              size={size}
              label={previousLabel}
              disabled={disabled || atStart}
              onClick={() => goTo(currentPage - 1)}
            />
          </PaginationItem>

          {items.map((item) =>
            typeof item === 'number' ? (
              <PaginationItem key={item}>
                <PaginationLink
                  page={item}
                  isActive={item === currentPage}
                  disabled={disabled}
                  onClick={() => goTo(item)}
                />
              </PaginationItem>
            ) : (
              <PaginationEllipsis key={item} />
            ),
          )}

          <PaginationItem>
            <PaginationNext
              size={size}
              label={nextLabel}
              disabled={disabled || atEnd}
              onClick={() => goTo(currentPage + 1)}
            />
          </PaginationItem>

          {showFirstLast ? (
            <PaginationItem>
              <IconButton
                icon={ChevronsRight}
                label={lastLabel}
                size={size}
                variant="ghost"
                disabled={disabled || atEnd}
                onClick={() => goTo(totalPages)}
              />
            </PaginationItem>
          ) : null}
        </PaginationContent>
      )}
    </nav>
  );
});

export interface PaginationContentProps extends HTMLAttributes<HTMLUListElement> {}

/** List that holds the pagination items. */
export const PaginationContent = forwardRef<HTMLUListElement, PaginationContentProps>(
  function PaginationContent({ className, ...rest }, ref) {
    return <ul ref={ref} className={cx(styles.list, className)} {...rest} />;
  },
);

export interface PaginationItemProps extends HTMLAttributes<HTMLLIElement> {}

/** Single slot in the list. */
export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(
  function PaginationItem({ className, ...rest }, ref) {
    return <li ref={ref} className={cx(styles.item, className)} {...rest} />;
  },
);

export interface PaginationLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Page this control jumps to. */
  page: number;
  /** Marks the current page. Set `aria-current="page"` and the active styling. */
  isActive?: boolean;
}

/** Page number button. */
export const PaginationLink = forwardRef<HTMLButtonElement, PaginationLinkProps>(
  function PaginationLink({ page, isActive = false, className, children, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={cx(styles.page, className)}
        aria-current={isActive ? 'page' : undefined}
        {...rest}
      >
        {children ?? page}
      </button>
    );
  },
);

interface PaginationStepProps extends Omit<IconButtonProps, 'icon' | 'label'> {
  /** Accessible name. */
  label: string;
}

/** Previous-page control. */
export const PaginationPrevious = forwardRef<HTMLButtonElement, PaginationStepProps>(
  function PaginationPrevious({ label, ...rest }, ref) {
    return <IconButton ref={ref} icon={ChevronLeft} label={label} variant="ghost" {...rest} />;
  },
);

/** Next-page control. */
export const PaginationNext = forwardRef<HTMLButtonElement, PaginationStepProps>(
  function PaginationNext({ label, ...rest }, ref) {
    return <IconButton ref={ref} icon={ChevronRight} label={label} variant="ghost" {...rest} />;
  },
);

export interface PaginationEllipsisProps extends HTMLAttributes<HTMLLIElement> {
  /** Text announced in place of the visual ellipsis. */
  label?: string;
}

/**
 * Visual marker for skipped pages. It is not interactive, and the visual dots
 * are hidden from assistive technology in favour of `label`.
 */
export const PaginationEllipsis = forwardRef<HTMLLIElement, PaginationEllipsisProps>(
  function PaginationEllipsis({ label = 'More pages', className, ...rest }, ref) {
    return (
      <li ref={ref} className={cx(styles.item, className)} {...rest}>
        <span className={styles.ellipsis} aria-hidden="true">
          …
        </span>
        <span className={styles.srOnly}>{label}</span>
      </li>
    );
  },
);
