import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';

import { cx } from '../../utils/cx';

import styles from './table.module.css';

export type TableVariant = 'default' | 'bordered';
export type TableSize = 'sm' | 'md' | 'lg';
export type TableAlign = 'left' | 'center' | 'right';
export type TableVerticalAlign = 'top' | 'middle' | 'bottom';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Separator treatment. Defaults to `default`, horizontal rules only. */
  variant?: TableVariant;
  /** Cell density. Defaults to `md`. */
  size?: TableSize;
  /** Alternating background on even rows. */
  striped?: boolean;
  /** Subtle background on row hover. */
  hoverable?: boolean;
}

/**
 * Data table container. The wrapper handles horizontal overflow; native table
 * elements keep the row and column semantics, so sorting, filtering, and
 * selection stay out of this component.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    variant = 'default',
    size = 'md',
    striped = false,
    hoverable = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      className={styles.container}
      data-variant={variant}
      data-size={size}
      data-striped={striped || undefined}
      data-hoverable={hoverable || undefined}
    >
      <table ref={ref} className={cx(styles.table, className)} {...rest}>
        {children}
      </table>
    </div>
  );
});

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ className, ...rest }, ref) {
    return <thead ref={ref} className={cx(styles.header, className)} {...rest} />;
  },
);

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...rest },
  ref,
) {
  return <tbody ref={ref} className={cx(styles.body, className)} {...rest} />;
});

export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter({ className, ...rest }, ref) {
    return <tfoot ref={ref} className={cx(styles.footer, className)} {...rest} />;
  },
);

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, ...rest },
  ref,
) {
  return <tr ref={ref} className={cx(styles.row, className)} {...rest} />;
});

interface CellLayoutProps {
  /** Horizontal alignment of the cell content. Defaults to `left`. */
  align?: TableAlign;
  /** Column width in CSS units. Numbers are treated as pixels. */
  width?: number | string;
  /** Minimum column width in CSS units. Numbers are treated as pixels. */
  minWidth?: number | string;
  /** Vertical alignment of the cell content. */
  verticalAlign?: TableVerticalAlign;
}

function toLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

function layoutStyle(
  { width, minWidth, verticalAlign }: CellLayoutProps,
  style: CSSProperties | undefined,
): CSSProperties | undefined {
  if (width === undefined && minWidth === undefined && verticalAlign === undefined) {
    return style;
  }

  return {
    ...style,
    ...(width !== undefined ? { width: toLength(width) } : null),
    ...(minWidth !== undefined ? { minWidth: toLength(minWidth) } : null),
    ...(verticalAlign !== undefined ? { verticalAlign } : null),
  };
}

export interface TableHeadProps
  extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align' | 'width' | 'valign'>,
    CellLayoutProps {}

/** Header cell. Renders `th` with `scope="col"` by default. */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { align = 'left', width, minWidth, verticalAlign, className, style, scope = 'col', ...rest },
  ref,
) {
  return (
    <th
      ref={ref}
      scope={scope}
      className={cx(styles.head, className)}
      style={layoutStyle({ width, minWidth, verticalAlign }, style)}
      data-align={align}
      {...rest}
    />
  );
});

export interface TableCellProps
  extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align' | 'width' | 'valign'>,
    CellLayoutProps {}

/** Data cell. Renders `td`. */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align = 'left', width, minWidth, verticalAlign, className, style, ...rest },
  ref,
) {
  return (
    <td
      ref={ref}
      className={cx(styles.cell, className)}
      style={layoutStyle({ width, minWidth, verticalAlign }, style)}
      data-align={align}
      {...rest}
    />
  );
});

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {}

/** Caption rendered as the table's native description. */
export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption({ className, ...rest }, ref) {
    return <caption ref={ref} className={cx(styles.caption, className)} {...rest} />;
  },
);
