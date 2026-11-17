---
'@orkest/ui': minor
---

Add the next batch of components: Skeleton, Spinner, Card, Table, DataTable, Pagination, and Empty State.

- `Skeleton` and `Spinner` hold layout and show progress while content loads.
- `Card`, `Table`, and `EmptyState` ship as composable presentational parts with shorthand APIs where useful.
- `DataTable` adds client-side sorting, search, pagination, selection, expandable rows, and column visibility from `@orkest/ui/client`.
- `Pagination` is controlled and handles clamping, ellipsis ranges, and first/last jumps.

Also includes fixes for pagination (no controls for a single page, equal-width page buttons), table and data-table caption placement, table variant pass-through, and documentation plus playground coverage for every new component.
