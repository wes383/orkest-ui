---
"@orkest/ui": minor
---

Add date and time inputs.

- `Calendar` is a standalone month grid with keyboard navigation, month and year switching, inclusive
  date bounds, and a `disabledDates` list or predicate. Dates are `YYYY-MM-DD` strings.
- `DatePicker` pairs a field with the calendar in a popover, with `Today` and `Clear` shortcuts,
  locale-aware formatting, and a hidden input when `name` is set.
- `TimePicker` selects `HH:mm` (or `HH:mm:ss`) values with 12-hour display, configurable minute steps,
  time bounds, typed entry, and scrollable hour, minute, and second columns.
