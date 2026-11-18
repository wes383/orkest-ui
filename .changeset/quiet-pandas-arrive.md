---
"@orkest/ui": minor
---

Add date, time, and searchable pickers, and extend the multi-value select.

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
