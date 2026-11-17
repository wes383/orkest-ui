# @orkest/ui

## 0.2.0

### Minor Changes

- caf8e54: Add the next batch of components: Skeleton, Spinner, Card, Table, DataTable, Pagination, and Empty State.
  
  - `Skeleton` and `Spinner` hold layout and show progress while content loads.
  - `Card`, `Table`, and `EmptyState` ship as composable presentational parts with shorthand APIs where useful.
  - `DataTable` adds client-side sorting, search, pagination, selection, expandable rows, and column visibility from `@orkest/ui/client`.
  - `Pagination` is controlled and handles clamping, ellipsis ranges, and first/last jumps.

## 0.1.1

### Patch Changes

- 8176a26: Document the npm install, the stylesheet import, and the client entry point in the package README,
  and link the repository and issue tracker from the package metadata. No runtime changes.

## 0.1.0

### Minor Changes

- 438fdd0: Prepare the first public release.
  
  - Primitives and typography: `Box`, `Stack`, `Grid`, `Separator`, `Icon`, `Text`, `Heading`,
    `Paragraph`, `Label`, `Caption`, `Small`, `Strong`, `Code`, and `Link`.
  - Content components: `Badge`, `Tag`, `Alert` with its parts, `Avatar` with image, fallback, and
    group parts, and `Toast` with its parts and the imperative `toast` API.
  - Form and action components: `Button`, `IconButton`, `Input`, `Textarea`, `Checkbox`, `Radio`,
    `RadioGroup`, `Switch`, `Field` with its parts, `Fieldset`, and `Legend`; form controls support
    controlled and uncontrolled usage.
  - Complex interactions built on Base UI: `Dialog` and `AlertDialog`, `DropdownMenu`, `Popover`,
    `Tooltip` with `TooltipProvider`, `Tabs`, `Select`, and `MultiSelect`.
  - Light and dark themes driven by semantic design tokens, with client-only components exported
    from `@orkest/ui/client`.
