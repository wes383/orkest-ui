# @orkest/ui

## 0.4.0

### Minor Changes

- 111b59a: Modernize component styling across the library.
  
  - Add theme-aware `--ui-shadow-*` elevation tokens and a layered light surface scale.
  - Draw a soft focus halo around input, select, date, and time controls.
  - Guard hover styles behind `hover: hover`, enlarge small action hit areas, and prevent iOS
    input zoom.
  - Refresh table headers, selected rows, pagination, alerts, toasts, dialog backdrop, spinner,
    checkbox, switch, tabs, and popup surfaces.
  - Increase the table and card surface radii to match the elevation scale.
  - Add an `srOnly` option to `TableCaption` for accessible-only table names.
  - Add `--ok-control-action-size-*`, spin, and shimmer duration tokens.

## 0.3.0

### Minor Changes

- aacc04c: Add date, time, and searchable pickers, and extend the multi-value select.
  
  - `Calendar` is a standalone month grid with keyboard navigation, listbox month and year switching,
    inclusive `minDate`/`maxDate` bounds, `disabledDates`, and a `range` span that paints an interval
    without changing the selected day. Dates are `YYYY-MM-DD` strings.
  - `DatePicker` pairs a field with the calendar in a popover, with `Today` and `Clear` shortcuts,
    `captionLayout="select"` for jumping across months, locale-aware formatting, and a hidden input
    when `name` is set.
  - `DateRangePicker` picks both ends in a single popover, showing one or two months side by side and
    giving every day in the span its own rounded chip.
  - `DateTimePicker` edits a date and a time in one panel that stays open until `Done`. Values are
    wall-clock `YYYY-MM-DDTHH:mm` (or `…:ss`) strings, and `timeMode="menu"` swaps the segmented time
    field for the `TimePicker` hour, minute, and second columns.
  - `TimePicker` selects `HH:mm` or `HH:mm:ss` with one editable segment per unit, arrow-key stepping,
    12-hour display, `minuteStep`, time bounds, and a scrollable column panel opened from the clock
    action.
  - `Combobox` is a searchable single-value picker built on Base UI's Combobox: typing filters the
    list, `renderItem` replaces option rows, `filterOption={null}` hands filtering to the caller for
    server-side search, and `loading` replaces the list with a busy status row.
  - `MultiSelect` gains `selectAll` (a pinned row that selects every enabled option in the current
    list and turns into `clearAllLabel` once all are on), `maxVisible` chip overflow with a `+N`
    counter, and `renderItem` for custom rows. `loading` now hides the stale options instead of
    showing them below the status row.
  - `Select`'s searchable mode is now a thin wrapper over `Combobox`, so it honours disabled options
    and clears the list while loading. The typing field no longer runs under the clear action.

## 0.2.1

### Patch Changes

- 3f5d909: Hide the browser's native clear button on search inputs. It was appearing in the DataTable search field; `clearable` remains the supported way to render a clear action.

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
