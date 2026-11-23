# Orkest UI

A neutral-first React component library with semantic design tokens, accessible primitives, and
light and dark themes.

Documentation: [ui.wesluma.com/docs](https://ui.wesluma.com/docs/)

## Requirements

- Node.js 20.9 or newer.
- pnpm 12, pinned through the root `packageManager` field.
- React 18.2 or 19 for consumers.

## Commands

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm lint
pnpm docs:dev
pnpm docs:build
```

## Install

```bash
pnpm add @orkest/ui
```

Import `@orkest/ui/style.css` once in your application. Client-side components are exported from
`@orkest/ui/client` and must render inside a Client Component (a module with `'use client'`).

## License

Apache-2.0. See [LICENSE](LICENSE).
