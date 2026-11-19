# AGENTS.md

## Project Overview

This repository contains **Orkest UI**, a reusable React component
library built with TypeScript. The goal is to provide a consistent,
accessible, well-tested, and maintainable UI foundation that can be
shared across Orkest and other React / Next.js applications.

Treat this repository as an independent product, not as a collection of
application-specific components.

The library should have its own visual language, design tokens,
component APIs, documentation, tests, and release process.

## Core Principles

1.  **Inspect before changing.** Read the existing implementation and
    project configuration before making assumptions.
2.  **Preserve established conventions.** Follow the repository's
    current architecture, naming, styling, export, and testing patterns
    unless there is a clear reason to change them.
3.  **Prefer incremental changes.** Implement work in small, verifiable
    steps. Avoid broad rewrites unless explicitly requested.
4.  **Consistency over quantity.** Prefer a small set of polished,
    predictable components over a large set of incomplete components.
5.  **Accessibility is required.** Keyboard interaction, focus behavior,
    semantic HTML, and accessible names are part of component
    correctness.
6.  **Use design tokens.** Do not introduce arbitrary colors, spacing,
    radii, or typography values when an appropriate token exists.
7.  **Keep the library business-agnostic.** Do not introduce
    Orkest-specific product logic into general-purpose components.
8.  **Verify claims.** Never report tests, type checks, builds, or
    manual verification as successful unless they were actually run and
    passed.

## Code Comments

- Write code comments in English.
- Add comments only when they explain non-obvious intent, constraints,
  trade-offs, or accessibility and browser behavior.
- Avoid comments that restate the code, repeat type information, or add
  no value.
- Do not leave commented-out code.

## Before Starting a Task

Before implementing a feature or fixing a bug:

1.  Read this file and any more specific `AGENTS.md` files in the
    relevant directories.
2.  Inspect the root `package.json`, workspace configuration, and
    relevant package configuration.
3.  Review the target component and nearby components to understand
    existing patterns.
4.  Check existing utilities, hooks, tokens, and dependencies before
    creating new ones.
5.  Identify the public API and consumers that may be affected.
6.  Determine which tests, documentation, and exports need to change.

Do not assume that an example, proposal, or historical project note
describes the current repository state. The checked-in code and
configuration are the source of truth.

## Technology and Dependencies

Use the versions and tools already configured in the repository. Do not
upgrade dependencies or replace tooling as part of an unrelated task.

General technology direction:

- React for UI components.
- TypeScript for implementation and public types.
- CSS Modules and CSS variables for component styling and theming,
  following the repository's established approach.
- pnpm for package management and workspace operations.
- Vitest and Testing Library for component tests, if configured.
- The in-repo documentation site (`apps/docs`) for component examples
  and documentation. Storybook is intentionally not used.
- Vite or the repository's existing build tool for library builds.
- Lucide React for icons, where the project has adopted it.

### Dependency Rules

Before adding a dependency:

- Check whether an existing dependency or native platform API already
  solves the problem.
- Prefer maintained libraries over hand-written implementations when
  they provide meaningful reliability, accessibility, or compatibility
  benefits.
- Evaluate bundle size, license, maintenance activity, React
  compatibility, SSR behavior, and API fit.
- Avoid dependencies that duplicate existing functionality.
- Explain why a new dependency is necessary in the task summary and,
  where appropriate, the commit body.

For complex interaction primitives such as Dialog, Popover, Select,
Combobox, and Dropdown Menu, use the project's adopted primitive
library, Base UI (`@base-ui/react`). Do not add a second primitive
library or implement positioning, dismissal, and focus management from
scratch. The library must still own its visual design, public API,
composition patterns, and documentation.

## Architecture and Code Organization

Follow the existing directory structure. Do not reorganize files merely
to match an example structure.

General expectations:

- Keep each component's implementation, styles, and tests close
  together when that matches the existing convention.
- Separate public exports from internal implementation details.
- Export only APIs that are intended to be supported.
- Keep shared utilities and hooks focused and reusable.
- Avoid circular dependencies between components.
- Avoid unnecessary abstraction layers and premature generalization.
- Keep components independent of application routing, application
  state, and backend services.

Do not expose internal helpers from the package entry point unless there
is a clear public use case.

## Design System and Styling

### Design Tokens

Use the existing design tokens for:

- Colors and semantic surfaces.
- Typography.
- Spacing.
- Component dimensions.
- Borders and radii.
- Shadows.
- Layering and z-index.
- Motion and transitions.

If a required token does not exist:

1.  Check whether an existing token can reasonably be reused.
2.  If not, propose the smallest appropriate addition.
3.  Add the token at the correct semantic level.
4.  Check the impact on existing components and themes.

Do not scatter hard-coded design values across component stylesheets.

### Theming

- Components should use semantic CSS variables rather than hard-coded
  theme colors.
- Support the themes already defined by the project.
- Do not introduce component-specific theme systems without a
  demonstrated need.
- Avoid global CSS changes that unintentionally affect consuming
  applications.
- Keep theme ownership clear: the library provides theme-aware styles;
  the host application controls application-level theme state unless
  the project explicitly defines otherwise.

### Interaction States

Where applicable, components should define and test:

- Default.
- Hover.
- Active or pressed.
- Focus-visible.
- Disabled.
- Loading.
- Invalid or error.
- Selected or expanded.

Do not communicate important state through color alone.

Respect `prefers-reduced-motion` for non-essential animations.

## Component API Guidelines

Public APIs should be consistent, minimal, and predictable.

- Use consistent prop names for shared concepts. For example, use
  `size` consistently rather than introducing alternatives such as
  `scale` without a strong reason.
- Use consistent size and variant values across related components
  where their meanings are the same.
- Provide sensible defaults.
- Prefer composition over a large collection of boolean props.
- Preserve relevant native HTML attributes and event types.
- Use accurate TypeScript types; avoid `any` unless there is a
  documented and unavoidable reason.
- Support controlled and uncontrolled usage where it is appropriate,
  especially for form and stateful components.
- Avoid exposing implementation details in public props.
- Avoid breaking existing public APIs without explicit approval.

For components based on native elements, extend the appropriate React
HTML attribute type when practical. For example, a button component
should preserve useful native button attributes and event types.

### Native Semantics

Use the correct HTML element for the job:

- Use `<button>` for actions.
- Use `<a>` for navigation.
- Use form elements for form controls.
- Use headings and landmarks according to document structure.

Do not use clickable `<div>` or `<span>` elements as substitutes for
native interactive elements.

## Accessibility Requirements

Accessibility is part of the definition of done.

For every relevant component, consider:

- Semantic HTML.
- Accessible names and descriptions.
- Appropriate ARIA roles, states, and properties.
- Keyboard navigation.
- Visible focus indicators.
- Logical focus order.
- Focus entry and restoration for overlays.
- Screen-reader announcements where needed.
- Sufficient color contrast.
- Reduced-motion preferences.

For dialogs and other overlays, verify the expected focus behavior,
Escape behavior, outside-click behavior, and scroll handling. Follow the
component's documented interaction contract rather than assuming every
overlay should behave identically.

Do not add ARIA attributes when native HTML semantics already provide
the required behavior. Incorrect ARIA is worse than unnecessary ARIA.

## Testing Requirements

Add or update tests whenever component behavior changes.

Use the test framework and conventions already configured in the
repository.

Tests should focus on user-observable behavior rather than
implementation details.

### Component Tests

Where relevant, cover:

- Rendering and default props.
- Variants and sizes.
- User interactions.
- Disabled and loading behavior.
- Controlled and uncontrolled behavior.
- Keyboard interaction.
- Native attribute forwarding.
- Accessible names and roles.
- Edge cases and regression scenarios.

### Overlay and Composite Component Tests

For components such as Dialog, Popover, Select, and Dropdown Menu, also
consider:

- Opening and closing.
- Escape key behavior.
- Outside interaction.
- Focus movement and restoration.
- Keyboard navigation between items.
- Selection behavior.
- Nested or portal rendering, if supported.
- Appropriate screen-reader semantics.

Do not delete, weaken, or skip tests merely to make a test suite pass.
If a test is outdated, explain why and replace it with an appropriate
test.

## Documentation

The repository uses a custom documentation site in `apps/docs` instead
of Storybook. Do not add Storybook or a second component implementation
for documentation examples.

Write documentation for consumers, not maintainers. Component pages
should explain what a component does, how to use its API, and what
behavior to expect. Do not document implementation details such as
internal class names, CSS selectors, DOM structure, internal state, or
styling token mechanics. Foundations and token reference pages may list
public design tokens, but component pages should describe the outcome,
not how it is implemented.

Add or update an MDX page when adding a component or changing meaningful
behavior. Documentation pages should demonstrate real component usage
and cover important public states, such as:

- Default usage.
- Variants and sizes.
- Disabled and loading states.
- Controlled behavior, where relevant.
- Long content and layout edge cases.
- Theme variations, where supported.

Component pages are ordered alphabetically by page title. Do not add an
`order` field to them; other sections use `order` to control their
sequence.

Import live examples from `@orkest/ui` and keep them aligned with the
actual public API. Do not create examples that rely on private
implementation details.

Define each preview's source as `export const <name>Code = `...`;`
immediately before its `<ComponentPreview>` and pass `code={<name>Code}`.
`lib/example-code.ts` reads those declarations and supplies them through
`MDXRemote`'s scope. Never put the template literal directly in the
`code={...}` JSX attribute: MDX strips its common indentation, which
flattens the example code shown on the page and in "Copy as Markdown".

Update relevant documentation when changing:

- Public props.
- Default behavior.
- Keyboard interaction.
- Accessibility behavior.
- Theme or styling requirements.
- Installation or consumption instructions.

## Build and Package Quality

When working on package configuration or build output:

- Follow the existing build setup.
- Preserve correct React peer dependency behavior.
- Ensure TypeScript declaration files are generated when required.
- Ensure CSS assets are emitted and exported correctly.
- Keep package exports explicit and aligned with actual build
  artifacts.
- Avoid exposing internal source files unintentionally.
- Check that consuming applications can resolve the package and its
  styles.
- Consider Next.js and SSR compatibility.

Do not claim that the package is publish-ready based only on a
successful local source build. When relevant, validate the packed
artifact in a separate consumer application.

## Commands and Verification

First inspect the scripts available in the relevant `package.json`
files. Use the repository's actual scripts rather than assuming command
names.

Run the most relevant checks for the change. Depending on the project
configuration, these may include:

```bash
pnpm test
pnpm typecheck
pnpm build
```

If a script does not exist, do not silently invent it or claim it was
run. Report that it is unavailable.

For a component change, normally verify:

1.  Relevant component tests.
2.  TypeScript checks.
3.  Package build.
4.  Documentation site or visual review, when applicable.

For package or export changes, also test the built package from a
consumer project where practical.

If a command fails:

- Include the failing command.
- Report the relevant error.
- Distinguish failures caused by your changes from pre-existing
  failures when evidence allows.
- Do not hide or work around failures without explaining the
  trade-off.

## Change Management

- Keep changes focused on the requested task.
- Avoid unrelated formatting or refactoring.
- Preserve backward compatibility unless a breaking change is
  explicitly requested.
- Update tests, exports, and documentation together.
- Call out public API changes.
- Call out dependency changes.
- Do not modify generated files manually unless the project requires
  it.
- Do not overwrite user changes or discard uncommitted work.

Before making broad changes, inspect the working tree and preserve
existing user modifications.

## Commit Conventions

- Commit after each completed change.
- Write the commit subject as one short English sentence in
  Conventional Commits format, for example
  `feat(button): add loading state` or
  `fix(dialog): restore focus on close`.
- Keep each commit scoped to a single logical change.
- Do not include generated artifacts or unrelated changes in a commit.

## Definition of Done

A component or feature is complete only when the applicable items below
are satisfied:

- [ ] The implementation follows the existing architecture and
      conventions.
- [ ] The public API is clear and consistent.
- [ ] Styles use the design system tokens.
- [ ] Relevant interaction states are implemented.
- [ ] Native semantics and accessibility requirements are addressed.
- [ ] TypeScript types are accurate.
- [ ] Tests cover important behavior and edge cases.
- [ ] Documentation pages are updated, where applicable.
- [ ] Public exports are correct.
- [ ] Relevant tests pass.
- [ ] Type checking passes.
- [ ] The package builds successfully.
- [ ] Known limitations and unverified behavior are documented.

Not every task requires every check. If a check is not relevant or
cannot be run, state that explicitly.

**Default development order:** Design system → primitives → common
components → complex interactions → documentation and quality → build
and release.
