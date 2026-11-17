# @orkest/ui

Neutral-first React component library with semantic design tokens, accessible primitives, and light
and dark themes.

## Status

`0.1.0` is published on npm. The public API may still change before `1.0.0`.

## Install

```bash
pnpm add @orkest/ui
```

React 18.2 or React 19 is required.

## Usage

```tsx
import { Stack, Text } from '@orkest/ui';
import '@orkest/ui/style.css';

export function Example() {
  return (
    <Stack gap={2}>
      <Text weight="semibold">Orkest UI</Text>
      <Text size="sm" tone="muted">
        Token-driven primitives.
      </Text>
    </Stack>
  );
}
```

## Components

- Primitives: `Box`, `Stack`, `Grid`, `Separator`, `Icon`
- Typography: `Text`, `Heading`, `Paragraph`, `Label`, `Caption`, `Small`, `Strong`, `Code`,
  `Link`
- Components: `Badge`, `Button`, `IconButton`, `Tag`
- Client components, exported from `@orkest/ui/client`: `Alert` (with parts), `AlertDialog` (with
  parts), `Avatar`, `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `Checkbox`, `Dialog` (with
  parts), `DropdownMenu` (with parts), `Field`, `FieldDescription`, `FieldLabel`, `FieldMessage`,
  `FieldRequiredIndicator`, `Fieldset`, `Input`, `Legend`, `MultiSelect`, `Popover` (with parts),
  `Radio`, `RadioGroup`, `Select`, `Switch`, `Tabs` (with parts), `Textarea`, `Toast` (with parts
  and the `toast` API), `Tooltip` (with parts), and `TooltipProvider`

## Client components

Components that use client-side state are exported from `@orkest/ui/client`:

```tsx
import { Avatar, AvatarFallback, Input, Select, Textarea, toast } from '@orkest/ui/client';
```

Render them inside a Client Component (a module with `'use client'`).

## Styling

`@orkest/ui/style.css` contains the primitive tokens, the semantic light and dark theme mappings, and
the component styles. The host application owns theme state and persistence: set
`data-orkest-theme="light"` or `"dark"` on the document root or a container. Without the attribute,
the stylesheet follows `prefers-color-scheme`.

The stylesheet does not load font files or override host application typography.

## Peer dependencies

React and React DOM `^18.2.0 || ^19.0.0`. `lucide-react` is a regular dependency because `Icon`
renders Lucide components. `@base-ui/react` is a regular dependency that provides overlay and popup
behavior for interactive components.

## Documentation

The documentation site lives in this repository. Run it from the repository root:

```bash
pnpm docs:dev
```

## License

Apache-2.0. See [LICENSE](LICENSE).
