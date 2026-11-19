---
'@orkest/ui': minor
---

Add `Command`, a keyboard-first palette for searching and running actions.

- `Command`, `Command.Input`, `Command.List`, `Command.Group`, `Command.Item`, `Command.Empty`,
  `Command.Separator`, and `Command.Shortcut` compose an inline palette. `Command.Dialog` places the
  same parts in a modal with a real title, a focus trap, and Escape handling.
- Typing filters by the item `value` and optional `keywords`, ignoring case, accents, and the
  separator used in the value. `shouldFilter={false}` hands filtering to the caller for server-side
  search.
- Arrow keys, Home, and End move the highlight and skip disabled commands; Enter and pointer clicks
  run `onSelect`. The highlight wraps unless `loop={false}`.
- The search field is a combobox that keeps focus while `aria-activedescendant` tracks the
  highlight. Groups collapse with their heading when nothing matches, and a polite live region
  announces the result count.
- The application owns the Cmd/Ctrl+K shortcut: the dialog registers no global listener, so mounting
  several palettes cannot conflict.
