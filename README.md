# Orkest UI

[![CI](https://github.com/wes383/orkest-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/wes383/orkest-ui/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@orkest/ui.svg)](https://www.npmjs.com/package/@orkest/ui)

A neutral-first React component library with semantic design tokens, accessible primitives, and
light and dark themes.

The repository is a pnpm monorepo containing the library and its custom documentation site.

## Status

`0.1.0` is published on npm. The current surface includes:

- Primitives: `Box`, `Stack`, `Grid`, `Separator`, `Icon`
- Typography: `Text`, `Heading`, `Paragraph`, `Label`, `Caption`, `Small`, `Strong`, `Code`,
  `Link`
- Components: `Badge`, `Button`, `IconButton`, `Tag`
- Client components: `Alert` (with parts), `AlertDialog` (with parts), `Avatar`,
  `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `Checkbox`, `Dialog` (with parts),
  `DropdownMenu` (with parts), `Field`, `FieldDescription`, `FieldLabel`, `FieldMessage`,
  `FieldRequiredIndicator`, `Fieldset`, `Input`, `Legend`, `MultiSelect`, `Popover` (with parts),
  `Radio`, `RadioGroup`, `Select`, `Switch`, `Tabs` (with parts), `Textarea`, `Toast` (with parts
  and the `toast` API), `Tooltip` (with parts), `TooltipProvider` (exported from
  `@orkest/ui/client`)

Core components and complex interactions are still in progress, and the public API may still change
before `1.0.0`.

## Workspace

| Path              | Package              | Purpose                                                     |
| ----------------- | -------------------- | ----------------------------------------------------------- |
| `packages/ui`     | `@orkest/ui`         | Component library source and build output                   |
| `apps/docs`       | `@orkest/docs`       | Documentation site (Next.js App Router + MDX)               |
| `apps/playground` | `@orkest/playground` | Private Next.js consumer used to validate the built package |

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
pnpm lint        # lint the workspace with ESLint
pnpm docs:dev    # build the library, then start the documentation site
pnpm docs:build  # build the library, then statically export the documentation site
pnpm playground:dev  # build the library, then start the consumer playground on port 3001
```

`eslint.config.js` at the repository root lints every workspace package with TypeScript,
React, and `jsx-a11y` rules. Inline disables are limited to pointer-only affordances that have
no keyboard equivalent, such as native dialog backdrops.

## Install

```bash
pnpm add @orkest/ui
```

React 18.2 or React 19 is required. The published package ships its built `dist` output, so nothing
else needs building. Inside this repository, run `pnpm build` once before starting the documentation
site or the playground, since both consume `dist`.

```tsx
import { Box, Stack, Text } from '@orkest/ui';
import '@orkest/ui/style.css';
```

Theme state belongs to the host application. Set `data-orkest-theme="light"` or `"dark"` on the
document root or a container; without the attribute the stylesheet follows `prefers-color-scheme`.

Client-only components are exported from `@orkest/ui/client`:

```tsx
import {
  Avatar,
  AvatarFallback,
  Input,
  MultiSelect,
  Select,
  Textarea,
} from '@orkest/ui/client';
```

They use client-side state and must render inside a Client Component.

## Documentation

Do not add Storybook. Component documentation, live examples, and API references belong in the
custom documentation site under `apps/docs/content`.

## License

Apache-2.0. See [LICENSE](LICENSE).
