---
'@orkest/ui': minor
---

Add `Command.Footer` and refine how the command list scrolls.

- `Command.Footer` renders a hint bar below the list. It provides the surface and layout only; the
  caller supplies the labels, so the palette stays language-neutral.
- The list uses the shared scrollbar skin, with the same thickness, colour, and end insets as the
  other scrollable surfaces.
- Moving the highlight scrolls the list itself. A palette embedded below the fold no longer scrolls
  the page when it mounts.
