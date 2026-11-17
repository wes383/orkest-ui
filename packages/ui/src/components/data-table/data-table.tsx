'use client';

import { Fragment, useMemo, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { cx } from '../../utils/cx';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { IconButton } from '../icon-button';
import { Input } from '../input';
import { Pagination } from '../pagination';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableAlign,
  type TableSize,
  type TableVariant,
} from '../table';

import styles from './data-table.module.css';

export interface DataColumn<TData> {
  /** Stable identifier used for sorting, visibility, and React keys. */
  id: string;
  /** Rendered in the header cell. */
  header: ReactNode;
  /** Value used for sorting and searching. */
  accessor: (row: TData) => unknown;
  /** Custom cell renderer. Defaults to the accessor value as text. */
  cell?: (row: TData) => ReactNode;
  /** Set to `false` to opt this column out of sorting. */
  sortable?: boolean;
  /** Set to `false` to exclude the column from the global search. */
  searchable?: boolean;
  align?: TableAlign;
  width?: number | string;
  minWidth?: number | string;
}

export interface DataTableProps<TData> {
  columns: DataColumn<TData>[];
  data: TData[];
  /**
   * Stable row identifier. Defaults to the row position in `data`, which keeps
   * selection attached to the right row when the table is sorted or paginated.
   */
  getRowId?: (row: TData, index: number) => string;
  /** Table caption, used as the accessible name. Visually hidden. */
  caption?: ReactNode;
  /** Rendered in place of rows when nothing matches. */
  emptyState?: ReactNode;
  /** Rows per page. Defaults to `10`. */
  pageSize?: number;
  /** Accessible name for the pagination landmark, useful when a page has several tables. */
  paginationLabel?: string;
  /** Separator treatment, passed to the table. Defaults to `default`. */
  variant?: TableVariant;
  /** Passed through to the table. Defaults to `md`. */
  size?: TableSize;
  striped?: boolean;
  /** Defaults to `true`. */
  hoverable?: boolean;
  /** Defaults to `true`. */
  sortable?: boolean;
  /** Defaults to `true`. */
  searchable?: boolean;
  /** Defaults to `true`. */
  paginated?: boolean;
  /** Adds a checkbox column and selects rows on the current page. */
  selectable?: boolean;
  /** Adds a toggle column that renders `renderExpanded` under the row. */
  expandable?: boolean;
  renderExpanded?: (row: TData) => ReactNode;
  /** Defaults to `true`. */
  columnVisibility?: boolean;
  /** Called with the selected rows whenever the selection changes. */
  onSelectionChange?: (rows: TData[]) => void;
  className?: string;
}

type SortDirection = 'asc' | 'desc';
interface SortState {
  columnId: string;
  direction: SortDirection;
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) {
    return 0;
  }

  if (a == null) {
    return 1;
  }

  if (b == null) {
    return -1;
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function matchesQuery(value: unknown, query: string): boolean {
  return String(value ?? '')
    .toLowerCase()
    .includes(query);
}

/**
 * Client-side data table with sorting, search, pagination, selection,
 * expansion, and column visibility. It renders the presentational `Table`
 * parts, so the visual language stays identical to a hand-built table.
 */
export function DataTable<TData>({
  columns,
  data,
  getRowId,
  caption,
  emptyState,
  pageSize = 10,
  paginationLabel,
  variant = 'default',
  size = 'md',
  striped = false,
  hoverable = true,
  sortable = true,
  searchable = true,
  paginated = true,
  selectable = false,
  expandable = false,
  renderExpanded,
  columnVisibility = true,
  onSelectionChange,
  className,
}: DataTableProps<TData>) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortState | null>(null);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(new Set());
  const [hiddenIds, setHiddenIds] = useState<ReadonlySet<string>>(new Set());

  const idByRow = useMemo(() => {
    return new Map(data.map((row, index) => [row, `${index}`] as const));
  }, [data]);

  const rowId = (row: TData, index: number) =>
    getRowId ? getRowId(row, index) : (idByRow.get(row) ?? `${index}`);

  const visibleColumns = useMemo(
    () => columns.filter((column) => !hiddenIds.has(column.id)),
    [columns, hiddenIds],
  );

  const searchableColumns = useMemo(
    () => columns.filter((column) => column.searchable !== false),
    [columns],
  );

  const filteredRows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return data;
    }

    return data.filter((row) =>
      searchableColumns.some((column) => matchesQuery(column.accessor(row), needle)),
    );
  }, [data, query, searchableColumns]);

  const sortedRows = useMemo(() => {
    if (!sort) {
      return filteredRows;
    }

    const column = columns.find((candidate) => candidate.id === sort.columnId);

    if (!column) {
      return filteredRows;
    }

    const direction = sort.direction === 'asc' ? 1 : -1;

    return [...filteredRows].sort(
      (a, b) => compareValues(column.accessor(a), column.accessor(b)) * direction,
    );
  }, [columns, filteredRows, sort]);

  const total = sortedRows.length;
  const pageCount = paginated ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const currentPage = Math.min(page, pageCount);
  const pageRows = paginated
    ? sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedRows;

  const pageEntries = pageRows.map((row, index) => ({
    row,
    id: rowId(row, (currentPage - 1) * pageSize + index),
  }));
  const pageIds = pageEntries.map((entry) => entry.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected = pageIds.some((id) => selectedIds.has(id));

  function toggleSort(columnId: string) {
    setSort((previous) => {
      if (previous?.columnId !== columnId) {
        return { columnId, direction: 'asc' };
      }

      if (previous.direction === 'asc') {
        return { columnId, direction: 'desc' };
      }

      return null;
    });
  }

  function commitSelection(next: ReadonlySet<string>) {
    setSelectedIds(next);
    onSelectionChange?.(data.filter((row, index) => next.has(rowId(row, index))));
  }

  function toggleRow(id: string, checked: boolean) {
    const next = new Set(selectedIds);

    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }

    commitSelection(next);
  }

  function togglePage(checked: boolean) {
    const next = new Set(selectedIds);

    for (const id of pageIds) {
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
    }

    commitSelection(next);
  }

  function toggleExpanded(id: string) {
    const next = new Set(expandedIds);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    setExpandedIds(next);
  }

  function toggleColumn(id: string, visible: boolean) {
    const next = new Set(hiddenIds);

    if (visible) {
      next.delete(id);
    } else {
      next.add(id);
    }

    setHiddenIds(next);
  }

  const columnCount =
    visibleColumns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);
  const firstRow = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastRow = paginated ? Math.min(currentPage * pageSize, total) : total;

  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.toolbar}>
        {searchable ? (
          <div className={styles.searchField}>
            <Input
              type="search"
              value={query}
              placeholder="Search…"
              aria-label="Search rows"
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
        ) : (
          <span />
        )}

        {columnVisibility ? (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" rightIcon={ChevronDown} />}>
              Columns
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
                  {columns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={!hiddenIds.has(column.id)}
                      onCheckedChange={(checked) => toggleColumn(column.id, checked)}
                    >
                      {column.header}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        ) : null}
      </div>

      <Table variant={variant} size={size} striped={striped} hoverable={hoverable}>
        {caption ? <TableCaption className={styles.srOnly}>{caption}</TableCaption> : null}
        <TableHeader>
          <TableRow>
            {expandable ? (
              <TableHead className={styles.toggleCell}>
                <span className={styles.srOnly}>Row details</span>
              </TableHead>
            ) : null}

            {selectable ? (
              <TableHead className={styles.selectCell}>
                <Checkbox
                  checked={allPageSelected}
                  indeterminate={!allPageSelected && somePageSelected}
                  aria-label="Select all rows on this page"
                  onCheckedChange={(checked) => togglePage(checked === true)}
                />
              </TableHead>
            ) : null}

            {visibleColumns.map((column) => {
              const isSorted = sort?.columnId === column.id;
              const canSort = sortable && column.sortable !== false;

              return (
                <TableHead
                  key={column.id}
                  align={column.align}
                  width={column.width}
                  minWidth={column.minWidth}
                  aria-sort={
                    isSorted
                      ? sort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : canSort
                        ? 'none'
                        : undefined
                  }
                >
                  {canSort ? (
                    <button
                      type="button"
                      className={styles.sortButton}
                      data-direction={isSorted ? sort.direction : undefined}
                      onClick={() => toggleSort(column.id)}
                    >
                      <span>{column.header}</span>
                      <ChevronDown className={styles.sortIcon} aria-hidden="true" size={14} />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={Math.max(columnCount, 1)} className={styles.empty}>
                {emptyState ?? 'No results.'}
              </TableCell>
            </TableRow>
          ) : null}

          {pageEntries.map(({ row, id }) => {
            const expanded = expandedIds.has(id);

            return (
              <Fragment key={id}>
                <TableRow data-selected={selectedIds.has(id) || undefined}>
                  {expandable ? (
                    <TableCell className={styles.toggleCell}>
                      <IconButton
                        icon={ChevronRight}
                        label={expanded ? 'Collapse row' : 'Expand row'}
                        size="sm"
                        variant="ghost"
                        className={styles.toggle}
                        aria-expanded={expanded}
                        data-expanded={expanded || undefined}
                        onClick={() => toggleExpanded(id)}
                      />
                    </TableCell>
                  ) : null}

                  {selectable ? (
                    <TableCell className={styles.selectCell}>
                      <Checkbox
                        checked={selectedIds.has(id)}
                        aria-label="Select row"
                        onCheckedChange={(checked) => toggleRow(id, checked === true)}
                      />
                    </TableCell>
                  ) : null}

                  {visibleColumns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.cell
                        ? column.cell(row)
                        : String(column.accessor(row) ?? '')}
                    </TableCell>
                  ))}
                </TableRow>

                {expandable && expanded ? (
                  <TableRow className={styles.expandedRow}>
                    <TableCell colSpan={Math.max(columnCount, 1)}>
                      {renderExpanded ? renderExpanded(row) : null}
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>

      {paginated ? (
        <div className={styles.footer}>
          <p className={styles.summary} aria-live="polite">
            {total === 0 ? 'No results' : `Showing ${firstRow}–${lastRow} of ${total}`}
          </p>
          <Pagination
            page={currentPage}
            totalPages={pageCount}
            size="sm"
            label={paginationLabel}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </div>
  );
}
