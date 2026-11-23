---
'@orkest/ui': minor
---

Add `Command` and refine titles, scrollbars, the calendar, and dialog focus rings.

## Command

- `Command`, `Command.Input`, `Command.List`, `Command.Group`, `Command.Item`, `Command.Empty`,
  `Command.Separator`, `Command.Shortcut`, and `Command.Footer` compose an inline palette.
  `Command.Dialog` places the same parts in a modal with a real title, a focus trap, and Escape
  handling.
- `Command.Footer` renders a hint bar below the list. It provides the surface and layout only; the
  caller supplies the labels, so the palette stays language-neutral.
- Typing filters by the item `value` and optional `keywords`, ignoring case, accents, and the
  separator used in the value. `shouldFilter={false}` hands filtering to the caller for server-side
  search.
- Arrow keys, Home, and End move the highlight and skip disabled commands; Enter and pointer clicks
  run `onSelect`. The highlight wraps unless `loop={false}`.
- The search field is a combobox that keeps focus while `aria-activedescendant` tracks the
  highlight. Groups collapse with their heading when nothing matches, and a polite live region
  announces the result count.
- Moving the highlight scrolls the list itself, so a palette embedded below the fold no longer
  scrolls the page when it mounts.
- The application owns the Cmd/Ctrl+K shortcut: the dialog registers no global listener, so mounting
  several palettes cannot conflict.

## Button

- Set `data-focus-ring="none"` on a button to hide its focus-visible outline when focus is restored
  programmatically, for example after a command selection. Remove the attribute on the next keyboard
  or pointer interaction to bring the ring back.

## Typography

- Titles set in the interface face now use the medium weight; titles that use the display face, such
  as Dialog and Popover, keep the semibold weight.

## Calendar

- Opening the month or year menu rotates the caption chevron.
- The selected day, the selected caption option, and today now share the same medium weight.
- Today uses the regular text colour instead of the accent colour.

## Scrollbars

- Every scrollable surface shares one skin: a lighter rounded thumb inset from both ends of the
  track, no native arrow buttons, and no hover colour change.

## Dialog

- The scrollable body reserves a small margin around its content, so focus halos are no longer
  clipped at the top, bottom, or sides.
