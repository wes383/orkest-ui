# @orkest/ui

Neutral-first React primitives with semantic design tokens and light and dark themes.

## Status

`0.1.0` is prepared but not published yet. The public API may still change before the package is
released.

Currently exported:

- Primitives: `Box`, `Stack`, `Icon`
- Typography: `Text`, `Heading`, `Paragraph`, `Label`, `Caption`, `Small`, `Strong`, `Code`,
  `Link`
- Components: `Badge`, `Button`, `IconButton`, `Tag`
- Client components: `Avatar`, `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `Input`, `Textarea`
  (exported from `@orkest/ui/client`)

## Install

Add the package as a workspace dependency:

```json
{
  "dependencies": {
    "@orkest/ui": "workspace:*"
  }
}
```

The package exports its built `dist` directory, so build it before starting or building a consumer:

```bash
pnpm --filter @orkest/ui build
```

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

## Client components

`Avatar`, `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `Input`, and `Textarea` are exported from
`@orkest/ui/client` because they use client-side state:

```tsx
import { Avatar, AvatarFallback, Input, Textarea } from '@orkest/ui/client';
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
renders Lucide components.

## Documentation

Run the documentation site from the repository root:

```bash
pnpm docs:dev
```

## License

Apache-2.0. See [LICENSE](LICENSE).
