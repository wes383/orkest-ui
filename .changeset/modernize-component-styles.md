---
"@orkest/ui": minor
---

Modernize component styling across the library.

- Add theme-aware `--ui-shadow-*` elevation tokens and a layered light surface scale.
- Draw a soft focus halo around input, select, date, and time controls.
- Guard hover styles behind `hover: hover`, enlarge small action hit areas, and prevent iOS
  input zoom.
- Refresh table headers, selected rows, pagination, alerts, toasts, dialog backdrop, spinner,
  checkbox, switch, tabs, and popup surfaces.
- Increase the table and card surface radii to match the elevation scale.
- Add an `srOnly` option to `TableCaption` for accessible-only table names.
- Add `--ok-control-action-size-*`, spin, and shimmer duration tokens.
