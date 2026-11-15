# Orkest UI

A neutral-first React component library with semantic design tokens, accessible primitives, and
light and dark themes.

The repository is a pnpm monorepo containing the library and its custom documentation site.

## Status

`0.1.0` is prepared but not published. The current surface includes:

- Primitives: `Box`, `Stack`, `Separator`, `Icon`
- Typography: `Text`, `Heading`, `Paragraph`, `Label`, `Caption`, `Small`, `Strong`, `Code`,
  `Link`
- Components: `Badge`, `Button`, `IconButton`, `Tag`
- Client components: `Avatar`, `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `Input`, `Textarea`
  (exported from `@orkest/ui/client`)

Core components and complex interactions are still in progress. `@orkest/ui` is not published to a
registry yet.

## Workspace

| Path | Package | Purpose |
| --- | --- | --- |
| `packages/ui` | `@orkest/ui` | Component library source and build output |
| `apps/docs` | `@orkest/docs` | Documentation site (Next.js App Router + MDX) |
| `apps/playground` | `@orkest/playground` | Private Next.js consumer used to validate the built package |

`Development-guide.md` and `Custom-documentation-spec.md` are local planning documents and are
intentionally not tracked.

## Requirements

- pnpm 12.11.2, pinned through the root `packageManager` field.
- A Node.js version supported by Next.js 16 for the documentation app.
- React 18.2 or React 19 for consumers.

## Commands

```bash
pnpm install
pnpm build       # build @orkest/ui
pnpm test        # run the library test suite
pnpm typecheck   # type-check the library, the documentation site, and the playground
pnpm docs:dev    # build the library, then start the documentation site
pnpm docs:build  # build the library, then statically export the documentation site
pnpm playground:dev  # build the library, then start the consumer playground on port 3001
```

`pnpm lint` is not configured in this repository.

## Consuming the package

The package exports its built `dist` directory, so build it first:

```tsx
import { Box, Stack, Text } from '@orkest/ui';
import '@orkest/ui/style.css';
```

Theme state belongs to the host application. Set `data-orkest-theme="light"` or `"dark"` on the
document root or a container; without the attribute the stylesheet follows `prefers-color-scheme`.

Client-only components are exported from `@orkest/ui/client`:

```tsx
import { Avatar, AvatarFallback, Input, Textarea } from '@orkest/ui/client';
```

They use client-side state and must render inside a Client Component.

## Documentation

Do not add Storybook. Component documentation, live examples, and API references belong in the
custom documentation site under `apps/docs/content`.

## License

Apache-2.0. See [LICENSE](LICENSE).
