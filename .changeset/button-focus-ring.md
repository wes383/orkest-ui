---
'@orkest/ui': minor
---

Allow buttons to suppress the focus ring when focus is restored programmatically.

Set `data-focus-ring="none"` on a button to hide its focus-visible outline, for example when a
command palette returns focus to its trigger after a selection. The caller removes the attribute on
the next keyboard or pointer interaction to bring the ring back.
