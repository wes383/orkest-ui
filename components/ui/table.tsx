import * as React from "react";
import { cn } from "@/lib/utils";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-x-auto">
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm border-collapse",
          className
        )}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b [&_tr]:border-border", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-muted font-medium", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-border transition-colors duration-base ease-out hover:bg-hover-bg data-[state=selected]:bg-accent-muted",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  TableHeadProps
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-11 px-3 text-left align-middle text-xs font-medium tracking-wide text-foreground-muted",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  TableCellProps
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-3 align-middle", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {}

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-foreground-muted", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export interface TableEmptyProps {
  colSpan?: number;
  children?: React.ReactNode;
  className?: string;
}

export const TableEmpty: React.FC<TableEmptyProps> = ({
  colSpan = 1,
  children = "No data",
  className,
}) => (
  <TableRow className="hover:bg-transparent">
    <TableCell colSpan={colSpan} className={cn("h-32", className)}>
      <div className="flex flex-col items-center justify-center text-center text-sm text-foreground-muted">
        {children}
      </div>
    </TableCell>
  </TableRow>
);
TableEmpty.displayName = "TableEmpty";
