# Orkest UI — Design System

> Elegant, minimal, modern component library for Next.js.
> shadcn/ui style — source is meant to be copied into your project.
> Built on Radix UI primitives, Tailwind CSS, and lucide-react icons.

**Aesthetic**: warm minimal. Off-white backgrounds (`#fcfbfa`), refined neutral foreground (`#25242a`), generous pill-shaped radii, low-contrast borders, three carefully paired fonts (Plus Jakarta Sans display, Inter body, JetBrains Mono code), and a 19-color project palette paired with five semantic colors.

---

## Table of Contents

1. [Design Tokens / Foundations](#1-design-tokens--foundations)
2. [Atoms](#2-atoms)
3. [Forms](#3-forms)
4. [Layout](#4-layout)
5. [Navigation](#5-navigation)
6. [Data Display](#6-data-display)
7. [Feedback & Overlay](#7-feedback--overlay)
8. [Media & Content](#8-media--content)
9. [Advanced / Composite](#9-advanced--composite)
10. [Utilities & Hooks](#10-utilities--hooks)
11. [Theming & Customization](#11-theming--customization)
12. [Accessibility](#12-accessibility)
13. [i18n & l10n](#13-i18n--l10n)
14. [Docs & DX](#14-docs--dx)
15. [Engineering & Quality](#15-engineering--quality)
16. [Often-Overlooked](#16-often-overlooked)

---

## Installation

```bash
# 1. Copy the files into your Next.js project
# 2. Install peer dependencies (see package.json)
npm install class-variance-authority clsx tailwind-merge \
  @radix-ui/react-* lucide-react next-themes sonner cmdk \
  embla-carousel-react react-day-picker input-otp \
  react-resizable-panels react-hook-form @hookform/resolvers zod

# 3. Configure Tailwind to read app/globals.css tokens
# 4. Wrap your app in <ThemeProvider> from components/theme-provider
```

Or use the shadcn CLI with the included `components.json`:

```bash
npx shadcn@latest init
npx shadcn@latest add button input dialog
```

---

## 1. Design Tokens / Foundations

**Source of truth**: `app/globals.css` (CSS variables) + `lib/tokens.ts` (TypeScript exports) + `tailwind.config.ts` (Tailwind mapping).

### 1.1 Color System

Three modes are supported: **Light**, **Dark**, and **High Contrast** (composable on top of either).

| Token | Light | Dark | High-Contrast (Light) |
|---|---|---|---|
| `--background` | `#fcfbfa` | `#101010` | `#ffffff` |
| `--surface` | `#ffffff` | `#181818` | `#ffffff` |
| `--sidebar` | `#fafaf9` | `#181818` | `#ffffff` |
| `--foreground` | `#25242a` | `#f5f5f5` | `#000000` |
| `--foreground-muted` | `#6d6770` | `#a3a3a3` | `#1a1a1a` |
| `--foreground-subtle` | `#9f99a3` | `#737373` | `#333333` |
| `--border` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.10)` | `#000000` |
| `--accent` | `#25242a` | `#f5f5f5` | `#000000` |
| `--accent-fg` | `#ffffff` | `#111111` | `#ffffff` |
| `--overlay` | `rgba(0,0,0,0.18)` | `rgba(0,0,0,0.55)` | `rgba(0,0,0,0.6)` |

`--overlay` is a black tint in every mode, so anything drawn *on* it — `LoadingOverlay`'s spinner and message — must contrast with the **page**, not the canvas. That means `text-foreground`, never `text-background`: `--background` *is* the canvas (`#fcfbfa` light / `#101010` dark), so it lands near-white in light mode and near-black in dark mode and reads as invisible against the scrim at both ends. `--foreground` also matches the `Spinner`'s `--accent` head in all four modes, so the pair stays consistent.

**Semantic colors** (light / dark):
- Blue `#2563eb` / `#93c5fd` — info, "medium" priority
- Orange `#ea580c` / `#fdba74` — warning, "high" priority
- Red `#dc2626` / `#fca5a5` — error, "urgent" priority
- Green `#16a34a` / `#86efac` — success
- Yellow `#ca8a04` / `#fde047` — caution

Each semantic color ships with `-soft` (background tint) and `-border` (matching border) variants, both auto-adjusted for dark mode (rgba-based for translucency).

Red additionally ships a **filled triple** — `--red-solid` / `--red-solid-hover` / `--red-solid-fg`, i.e. `bg-red-solid` / `hover:bg-red-solid-hover` / `text-red-solid-fg` — used by every destructive surface (Button `danger`, AlertDialog action, Popconfirm confirm). Unlike the rest of the palette it is deliberately **not inverted in dark mode**: `--red` in dark is a pale tint (`#fca5a5`) sized for text and icons, and painting white text on a pale tint is exactly the washed-out result this token exists to avoid. So the fill stays a saturated red in every mode — `#dc2626` normally (`#b91c1c` on hover), `#cc0000` (`#990000`) in high contrast — with white text on top.

**Project palette** (19 colors, used for tags/avatars/accents):
`red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose, gray, slate`.

Use them via Tailwind classes under the `palette` namespace, e.g. `bg-palette-indigo`, `text-palette-violet`, or compute soft triples via `softColorTriple(hex)` from `lib/utils.ts`.

### 1.2 Typography System

| Token | Latin font | CJK fallback | Usage |
|---|---|---|---|
| `--font-sans` | Inter (next/font) | Noto Sans SC | Body, UI text |
| `--font-display` | Plus Jakarta Sans (500–800) | Noto Sans SC | Headings, titles |
| `--font-mono` | JetBrains Mono | Noto Sans SC | Code, numbers, kbd |

**CJK font — Source Han Sans (Noto Sans SC)**: loaded via `next/font/google` in `app/layout.tsx` as `--font-noto-sans-sc`, then referenced in all three font stacks in `app/globals.css`. This means Latin glyphs render in Inter / Plus Jakarta Sans / JetBrains Mono, while Chinese glyphs uniformly fall back to Noto Sans SC across body, headings, **and code** — including `<Code>`, `kbd`, monospace numerics, and inline code in toasts. Weights loaded: 400 / 500 / 700. `preload: false` + `display: "swap"` to keep large CJK files off the critical path.

**Type scale** (size / line-height):
`xs` 12/1.5 · `sm` 13/1.5 · `base` 15/1.5 · `lg` 18/1.3 · `xl` 20/1.3 · `2xl` 24/1.1 · `3xl` 28/1.1 · `4xl` 32/1.1 · `5xl` 40/1.1.

**Letter-spacing**: `tight` (-0.02em, headings), `normal` (0), `wide` (0.04em, labels).

**Font weights**: Inter 400/500/600/700, Plus Jakarta Sans 500/600/700/800, JetBrains Mono 400/500/600, Noto Sans SC 400/500/700.

```tsx
import { Heading, Text, Code, Muted, Blockquote } from "@/components/ui/typography";
<Heading level="h1">Orkest orchestrate your time</Heading>
<Text variant="muted">Focus on the present, plan for the future.</Text>
<Code>var(--blue: #2563eb)</Code>
```

### 1.3 Spacing System

4/8 base — `1: 4px`, `2: 8px`, `3: 12px`, `4: 16px`, `5: 20px`, `6: 24px`, `8: 32px`, `10: 40px`, `12: 48px`, `16: 64px`, `20: 80px`, `24: 96px`.

All Tailwind spacing utilities (`p-4`, `gap-6`, `mt-8`) map to these tokens.

### 1.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Small controls, kbd, code |
| `--radius-md` | 12px | Badges, menu items |
| `--radius-lg` | 16px | Cards, inputs, panels |
| `--radius-xl` | 24px | Textareas |
| `--radius-2xl` | 32px | Modals |
| `--radius-full` | 9999px | Buttons, pills, avatars, switches |

### 1.5 Elevation / Shadow

| Token | Value | Usage |
|---|---|---|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.04)` | Subtle depth |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | Buttons, inputs |
| `--shadow-md` | `0 4px 12px rgba(28,24,35,0.06)` | Cards (raised) |
| `--shadow-pop` | `0 20px 45px rgba(28,24,35,0.10)` | Popovers, dropdowns, toasts |
| `--shadow-dialog` | `0 28px 80px rgba(28,24,35,0.14)` | Modals, dialogs |
| `--shadow-fab` | `0 18px 45px rgba(37,36,42,0.22)` | Floating action buttons |

Dark mode uses deeper shadows (alpha 0.4–0.55).

### 1.6 Borders & Dividers

- Default border: `rgba(0,0,0,0.08)` — barely visible, defines edges softly.
- Strong border: `rgba(0,0,0,0.22)` — used on hover/focus.
- Ring: matches strong border for keyboard focus.
- Dividers use `--border` via `<Divider>` or `<Separator>`.

### 1.7 Breakpoints

`sm: 640px` · `md: 768px` · `lg: 1024px` · `xl: 1280px` · `2xl: 1536px`. Container max-width: 1400px.

Use `useBreakpoint()` / `useMediaQuery(query)` for JS-driven responsive logic.

### 1.8 Motion Tokens

**Durations**: `fast` 100ms, `base` 150ms, `slow` 200ms, `slower` 300ms.
**Easings**: `out` `cubic-bezier(0.16, 1, 0.3, 1)` (default), `in-out` `cubic-bezier(0.4, 0, 0.2, 1)`, `spring` `cubic-bezier(0.34, 1.56, 0.64, 1)`.

Animations defined: `animate-fade-in`, `animate-fade-slide-in`, `animate-scale-in`, `animate-slide-in-right`, `animate-slide-in-left`, `animate-spin-slow`, `animate-shimmer`, `animate-pulse-soft`, `animate-accordion-down`, `animate-accordion-up`.

`prefers-reduced-motion` is respected globally (durations collapse to 0.01ms).

### 1.9 Z-Index Hierarchy

`base: 0` → `dropdown: 30` → `sticky: 40` → `tooltip: 40` → `popover: 50` → `modal: 60` → `toast: 70`.

### 1.10 Icon System

- Library: **lucide-react** (1,500+ icons, tree-shakeable).
- Default size: 16px (`md`). Sizes: `sm` 14, `md` 16, `lg` 20, `xl` 24.
- Stroke width: 2. Inherits `currentColor`.
- Use the `Icon` wrapper for consistent sizing.

```tsx
import { Icon } from "@/components/ui/icon";
import { Plus } from "lucide-react";
<Icon as={Plus} size="md" />
```

### 1.11 Theme Variables (Runtime Switching)

All tokens are CSS variables on `:root` / `html.dark` / `html.high-contrast`. Switch at runtime by toggling classes on `<html>`:

```tsx
import { useAppTheme } from "@/components/theme-provider";

function ThemeToggle() {
  const { isDark, toggleTheme, toggleHighContrast } = useAppTheme();
  return <Button onClick={toggleTheme}>{isDark ? "Light" : "Dark"}</Button>;
}
```

For multi-brand theming, inject CSS variables from a `ThemeTokens` object via `tokensToCssVars()` in `lib/tokens.ts`.

### 1.12 Density Tiers

Every control ships a comfortable default that matches the warm-minimal aesthetic. For data-heavy screens (dashboards, tables, admin forms) the library exposes an **opt-in** compact tier instead of leaving you to override classes by hand. Defaults are unchanged — nothing tightens unless you ask for it.

Two axes:

- **`size`** — for leaf controls. Components that already had `sm` / `md` / `lg` gain an `xs`: `Button`, `Input`, `Textarea`, `InputNumber`, `InputOTP`, `SelectTrigger`, `Combobox`, `DatePicker` / `TimePicker` / `DateTimePicker`. `Badge` and `Tag` follow the density through their existing `size` scale.
- **`density`** — for row-based containers, propagated to their children through React context so only the root needs the prop. Values: `compact` / `default` / `comfortable`.

**Shape is preserved, not normalised.** Pill-shaped elements (`Button`, `Chip`, `Pill`, `Avatar`, `Switch`, `Slider`, radio dots) stay pills in every tier. Field-like controls (`Input`, `Textarea`, `SelectTrigger`, picker triggers, `InputNumber`, `InputOTP`) stay rounded rectangles, which is why their radius lives in the size variant rather than the base class: `--radius-lg` is `16px`, and on an `h-8` (32px) field that is exactly half the height — the compact tier would otherwise silently turn every field into a capsule. Compact fields therefore use `--radius-md` (`12px`).

| Component | Prop | Compact | Default |
|---|---|---|---|
| `Button` | `size="xs"` | `h-8 px-3 text-xs` (still `rounded-full`) | `md`: `h-10 px-5 text-sm` |
| `Input` | `size="xs"` | `h-8 px-2.5 text-xs rounded-md` | `md`: `h-12 px-4 text-base rounded-lg` |
| `Textarea` | `size="xs"` | `min-h-16 p-2 px-2.5 text-xs rounded-md` | `md`: `min-h-24 p-3 px-4 text-base rounded-xl` |
| `InputNumber` | `size="xs"` | shell `h-8 rounded-md`, steppers `px-2` | `md`: shell `h-12 rounded-lg`, steppers `px-3` |
| `InputOTP` | `size="xs"` on `InputOTPSlot` | slot `w-8 aspect-square rounded-md text-sm` | `md`: slot `w-12 aspect-square rounded-lg text-lg` |
| `Select` | `size="xs"` on `SelectTrigger` | `h-8 px-2.5 text-xs rounded-md` | `md`: `h-12 px-4 text-sm rounded-lg` |
| `DatePicker` / `TimePicker` / `DateTimePicker` | `size="xs"` (or omit) | trigger `h-8 text-xs rounded-md` | `md`: `h-12 rounded-lg` |
| `Combobox` | `size="xs"` (or omit) | trigger `h-8 text-xs rounded-md`, panel `rounded-md p-0`, item `py-1 text-xs` | `md`: trigger `h-12 rounded-lg`, panel `rounded-lg`, item `py-1.5 text-sm` |
| `SelectContent` | `density="compact"` | panel `p-0.5`, item `py-1.5 pl-8 text-xs` | panel `p-1`, item `py-2 pl-9 text-sm` |
| `DropdownMenuContent` | `density="compact"` | items `py-1.5` | items `py-2` |
| `ContextMenuContent` | `density="compact"` | items `py-1.5` | items `py-2` |
| `Table` | `density="compact"` | head `h-9`, cell `px-3 py-1.5` | head `h-11`, cell `p-3` |
| `Card` | `density="compact"` | `p-4` | `p-5` |
| `List` | `density="compact"` | `py-1.5` | `py-2` |
| `Menu` | `density="compact"` | `px-2 py-1` | `px-3 py-2` |
| `Tabs` | `density="compact"` on `Tabs` | list `gap-0.5 p-0.5`, trigger `px-3 py-1.5 text-xs` | list `gap-1 p-1`, trigger `px-4 py-2.5 text-sm` |
| `Pagination` | `density="compact"` on `Pagination` | link `h-7 min-w-7 text-xs` | link `h-9 min-w-9 text-sm` |
| `Accordion` | `density="compact"` on `Accordion` | trigger `py-2.5 text-xs` | trigger `py-4 text-sm` |
| `Descriptions` | `density="compact"` | cell `px-3 py-1.5 text-xs` | cell `px-4 py-2.5 text-sm` |
| `Steps` | `density="compact"` on `Steps` | indicator `h-6 w-6 text-xs` | indicator `h-8 w-8 text-sm` |
| `Timeline` | `density="compact"` on `Timeline` | dot `h-5 w-5`, item `gap-3 pb-4` | dot `h-6 w-6`, item `gap-4 pb-6` |
| `Alert` | `density="compact"` | `gap-2 p-2.5 rounded-md text-xs` | `gap-3 p-3.5 rounded-lg text-sm` |
| `Command` | `density="compact"` on `Command` | input `h-8 text-xs`, item `py-1 text-xs` | input `h-12 text-sm`, item `py-1.5 text-sm` |
| `Calendar` | `density="compact"` | day `h-7 w-7 text-xs`, shell `p-1.5` | day `h-8 w-8 text-sm`, shell `p-2` |
| `WheelPicker` | `density="compact"` | row `28px`, `text-xs` | row `36px`, `text-sm` |
| `Checkbox` | `density="compact"` | `h-3.5 w-3.5`, glyph `h-2.5 w-2.5` | `h-4 w-4`, glyph `h-3 w-3` |
| `RadioGroup` `RadioGroupItem` `RadioCard` | `density="compact"` | dot `h-3.5 w-3.5`, card `p-3` | dot `h-4 w-4`, card `p-4` |
| `Switch` | `density="compact"` | track `h-[18px] w-8` (still `rounded-full`) | track `h-[22px] w-10` |
| `Slider` | `density="compact"` | track `h-1`, thumb `h-3.5 w-3.5` | track `h-1.5`, thumb `h-4 w-4` |
| `Chip` | `density="compact"` | `text-xs py-0.5` | `text-sm py-1` |
| `Badge` | follows the density via `size` | `size="sm"` | `md`: `text-sm px-3 py-1` |
| `Tag` | follows the density via `size` | `size="sm"` | `md`: `text-xs px-2 py-0.5` |

Deliberately **not** density-aware: layout primitives (`Flex` / `Grid` / `Stack` / `Container` — spacing is author-specified), decorative atoms (`Avatar`, `Progress`, `Skeleton`, `Spinner`, `Separator`, `Divider`, `Kbd`, `Pill`) and overlay shells (`Dialog`, `Drawer`, `Popover`, `Tooltip` — already minimal).

`density` reaches descendants through context, so setting it once on the root (`<Table>`, `<Card>`, `<Tabs>`, `<SelectContent>`, `<Command>`, …) is enough. Any individual child can still override it with its own `density` prop.

```tsx
<Card density="compact">
  <CardHeader>
    <CardTitle>Weekly report</CardTitle>
  </CardHeader>
  <CardContent>
    <Table density="compact">
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ship docs</TableCell>
          <TableCell>Wes</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Button size="xs" className="mt-3">
      Add row
    </Button>
  </CardContent>
</Card>
```

**Global density (`DensityProvider`)**

Instead of tagging every component, mount `DensityProvider` once and let an app-level switch drive the whole tree. Components resolve their tier as: explicit `size` / `density` prop → surrounding density → `"default"`.

```tsx
import { DensityProvider, useDensityMode } from "@/components/density-provider";

function DensitySwitch() {
  const { density, setDensity } = useDensityMode();
  return (
    <button onClick={() => setDensity(density === "compact" ? "default" : "compact")}>
      {density === "compact" ? "Default" : "Compact"}
    </button>
  );
}

<DensityProvider>
  <DensitySwitch />
  <App />
</DensityProvider>
```

- Persists the choice to `orkest-density` in localStorage.
- Optional: the library falls back to `"default"` without a provider, so it is safe to mount only where a switch is offered.
- `useDensity()` reads the value (never throws); `useDensityMode()` also returns `setDensity` and requires a provider.
- The showcase page's header switch is built on this — see `app/_components/density-toggle.tsx`.

---

## 2. Atoms

The lowest-level reusable units. Located in `components/ui/`.

| Component | File | Variants / Notes |
|---|---|---|
| `Button`, `ButtonGroup` | button.tsx | variants: default/outline/ghost/danger/subtle/link; sizes: xs/sm/md/lg/icon/icon-sm/icon-xs/fab; loading state; `asChild` via Slot |
| `Link` / Text Link | (use `Button variant="link"` or `<a>`) | — |
| `Icon` | icon.tsx | Wraps any lucide icon, sm/md/lg/xl sizes |
| `Typography`, `Heading`, `Text`, `Code`, `Muted`, `Blockquote` | typography.tsx | Polymorphic `as` prop |
| `Avatar`, `AvatarGroup` | avatar.tsx | Radix Avatar, 6 sizes, initials fallback, `max` overflow |
| `Badge` | badge.tsx | 7 variants (default/secondary/outline/success/warning/danger/info), optional dot |
| `Tag` | tag.tsx | Small monospace chip, default/solid |
| `Chip` | chip.tsx | Removable, with optional prefix |
| `Divider` | divider.tsx | Horizontal/vertical, optional centered label |
| `Separator` | separator.tsx | Radix-powered, ARIA-compliant |
| `Spinner` | spinner.tsx | 4 sizes, role="status" |
| `Skeleton`, `SkeletonText`, `SkeletonCircle` | skeleton.tsx | `animate-pulse-soft` |
| `Progress`, `CircularProgress` | progress.tsx | Linear (thin/default/thick) + circular SVG |
| `Tooltip` | tooltip.tsx | Radix Tooltip, 300ms delay, surface bubble — white in light / near-black in dark, bordered + `shadow-md` (not inverted) |
| `Popover` | popover.tsx | Radix Popover, `bg-surface` + `shadow-pop`, optional `container` for use inside a Dialog |
| `HoverCard` (+ Trigger/Content) | hover-card.tsx | Radix HoverCard, opens on hover *and* keyboard focus (openDelay 300ms / closeDelay 120ms); same surface as `Popover`; holds multi-line content |
| `Kbd` | kbd.tsx | Keyboard key display |

```tsx
<Button variant="default" size="md">
  <Icon as={Plus} /> New Task
</Button>
<Badge variant="success" dot>Completed</Badge>
<AvatarGroup max={3}>
  <Avatar src="/a.jpg" name="Alice" />
  <Avatar name="Bob" />
</AvatarGroup>
```

---

## 3. Forms

| Component | File | Notes |
|---|---|---|
| `Label` | label.tsx | Radix Label, peer-state hooks |
| `Input`, `InputWithIcon`, `PasswordInput` | input.tsx | Variants (default/error), sizes (xs/sm/md/lg), Eye toggle for password |
| `Textarea` | textarea.tsx | `rounded-xl`, optional `showCount` character counter |
| `Select` (+ all sub-components) | select.tsx | Radix Select, check indicator, scroll buttons, trigger sizes (xs/sm/md/lg) |
| `Combobox` | combobox.tsx | Single- *or* multi-select `Popover` + `Command` field, type-to-filter, option `description` / `icon` / `keywords` / `disabled`, sizes (xs/sm/md/lg), remote search (`searchValue` / `loading` / `selectedOption` / `shouldFilter`), `multiple`, `creatable` |
| `Checkbox`, `CheckboxGroup` | checkbox.tsx | Check / Minus (indeterminate), group with `onValueChange` |
| `RadioGroup`, `RadioGroupItem`, `RadioCard` | radio-group.tsx | Standard + card-style selectable |
| `Switch` | switch.tsx | Radix Switch |
| `Slider`, `RangeSlider` | slider.tsx | Radix Slider, multi-thumb support |
| `InputNumber` | input-number.tsx | +/- buttons, min/max/step, clamp |
| `InputOTP` (+ Group/Slot/Separator) | input-otp.tsx | Verification codes; slots are `aspect-square` with `min-w-0`, so a six-digit row compresses instead of overflowing a narrow card |
| `DatePicker` | date-picker.tsx | `Popover` + `Calendar`; `mode="single" \| "range"`, `shortcuts` (Today / This week / …), `minDate` / `maxDate` / `disabledDates`, sizes (xs/sm/md/lg) |
| `TimePicker` | time-picker.tsx | iOS-style wheel columns (hour + minute, AM/PM when 12-hour); `minuteStep`, 12/24-hour follows the page language or `use12Hour`; value is an `"HH:mm"` string |
| `DateTimePicker` | date-time-picker.tsx | Day grid and wheel columns in one panel; value is an ISO string; same `minDate` / `maxDate` / `minuteStep` / `use12Hour` knobs |
| `PasswordStrength` | password-strength.tsx | 0-4 strength meter + checklist |
| `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` | form.tsx | react-hook-form + zod integration |

> **DateRangePicker** is not a separate component — it is `<DatePicker mode="range" />`, whose value is a `DateRange` (`{ from, to? }`). All three pickers sit on `Calendar` (`Data Display`) plus the wheel columns in `picker-shared.tsx`, so you can compose a different trigger around either primitive.

### Form Validation Pattern

```tsx
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useForm({ resolver: zodResolver(schema) });

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" {...field} />
          </FormControl>
          <FormDescription>We'll never share your email.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

### Components NOT included (and why)

- **Upload / Cropper**: Out of scope — integrate [`react-dropzone`](https://github.com/react-dropzone/react-dropzone) + [`react-easy-crop`](https://github.com/ValentinH/react-easy-crop).
- **ColorPicker**: Use [`react-colorful`](https://github.com/omgovich/react-colorful).
- **Cascader / TreeSelect / Transfer / Mentions / AutoComplete**: Build with `Popover` + `Command` (cmdk) primitives. See section 9. (For a plain searchable single-select, use `Combobox` — it already wraps that pair.)

---

## 4. Layout

| Component | File | Notes |
|---|---|---|
| `Container` | container.tsx | Sizes: sm/md/lg/xl/full, polymorphic |
| `Grid`, `Row`, `Col` | grid.tsx | Responsive `columns={{base,sm,md,lg,xl,2xl}}`, 12-col span system |
| `Stack` | stack.tsx | Vertical flex, optional `divider` between items |
| `Flex` | flex.tsx | direction/justify/align/wrap/gap |
| `AspectRatio` (`Ratio`) | aspect-ratio.tsx | Radix AspectRatio |
| `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` | resizable.tsx | `react-resizable-panels` |
| `ScrollArea` | scroll-area.tsx | Radix ScrollArea, custom styled scrollbar |
| `Center` / `AbsoluteCenter` | (use `<Flex items="center" justify="center">`) | — |
| `Affix` / `Sticky` | (use `position: sticky; z-sticky`) | — |
| `Anchor` | Roadmap — use `<nav>` + IntersectionObserver | — |

```tsx
<Grid columns={{ base: 1, md: 2, lg: 4 }} gap="lg">
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
  <Card>4</Card>
</Grid>
```

---

## 5. Navigation

| Component | File | Notes |
|---|---|---|
| `Tabs` (+ List/Trigger/Content) | tabs.tsx | Radix Tabs, bottom 2px accent underline |
| `Menu` (+ Label/Item/Divider/Group) | menu.tsx | Static presentational menu |
| `DropdownMenu` (+ full compound) | dropdown-menu.tsx | Radix DropdownMenu, sub-menus, checkbox/radio items, destructive variant |
| `ContextMenu` (+ full compound) | context-menu.tsx | Radix ContextMenu (right-click), sub-menus, checkbox/radio items, destructive variant, `density` |
| `Breadcrumb` (+ full compound) | breadcrumb.tsx | `asChild` for next/link, ellipsis support |
| `Pagination` (+ full compound) | pagination.tsx | href or onClick, `aria-current="page"` |
| `Steps` (+ Step/StepItem/StepLabel/StepIndicator/StepSeparator) | steps.tsx | Horizontal/vertical, waiting/active/complete states |
| `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandItem`, ... | command.tsx | cmdk-powered Cmd+K palette |

### Command Palette Recipe

```tsx
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>
        <Calendar /> Calendar
        <CommandShortcut>⌘C</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

Bind to `⌘K` globally:

```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen(v => !v);
    }
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, []);
```

---

## 6. Data Display

| Component | File | Notes |
|---|---|---|
| `Card` (+ Header/Title/Description/Content/Footer/Action) | card.tsx | `hoverable` prop, density: compact/default/comfortable |
| `Table` (+ Header/Body/Footer/Row/Head/Cell/Caption/Empty) | table.tsx | Native `<table>`, hoverable rows, `data-[state=selected]`, density: compact/default/comfortable |
| `List` (+ Item/Separator) | list.tsx | density: compact/default/comfortable |
| `Empty` (+ Icon/Title/Description/Actions) | empty.tsx | Dashed border, centered |
| `Result` (+ Icon/Title/Subtitle/Actions) | result.tsx | success/error/warning/info/404/403/500 |
| `Statistic` (+ Label/Value/Suffix/Prefix/Trend) | statistic.tsx | Plus `StatisticCard` wrapper |
| `Timeline` (+ Item/Separator/Dot/Content/Title/Description/Time) | timeline.tsx | Vertical timeline with colored dots |
| `Accordion` (+ Item/Trigger/Content) | accordion.tsx | Radix Accordion, animated expand |
| `Calendar` | calendar.tsx | react-day-picker, single/range/multiple modes, `density` |
| `WheelPicker` (+ `WheelPickerItem`) | wheel-picker.tsx | Snapping scroll column, `density` — the primitive under `TimePicker` / `DateTimePicker` |
| `Image` | image.tsx | Lazy load, fallback, skeleton placeholder |
| `Carousel` (+ Content/Item/Previous/Next) | carousel.tsx | embla-carousel-react; prev/next sit outside the track (3-track grid) |
| `QRCode` | qrcode.tsx | Pure SVG (no dependency) |
| `Descriptions` (+ Item/Label/Content) | descriptions.tsx | Key-value list, responsive |

### Table Pattern

`density` is set on `<Table>` and inherited by every head/cell inside it — use `density="compact"` for data-heavy grids. See [1.12 Density Tiers](#112-density-tiers).

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Task</TableHead>
      <TableHead>Priority</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow data-state="selected">
      <TableCell>Weekly report</TableCell>
      <TableCell><Badge variant="warning">High</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Virtual Scrolling

For large lists, use `useVirtualList`:

```tsx
const { virtualItems, totalHeight } = useVirtualList({
  itemCount: 10000,
  itemHeight: 48,
  viewportHeight: 600,
});
```

---

## 7. Feedback & Overlay

| Component | File | Notes |
|---|---|---|
| `Dialog` (+ Trigger/Overlay/Content/`Body`/Header/Footer/Title/Description/Close) | dialog.tsx | Radix Dialog, `rounded-xl`, `shadow-dialog`, focus trap; capped to `calc(100dvh - 2rem)` with a scrolling `DialogBody` |
| `AlertDialog` (+ full compound) | alert-dialog.tsx | Compact confirmation, destructive action; same viewport cap, scrolls as one piece |
| `Drawer` (+ Trigger/Overlay/Content/`Body`/Header/Footer/Title/Description/Close) | drawer.tsx | Side: left/right/top/bottom, slide-in; sits 8px inside the viewport edge with `rounded-xl` and a border on all four sides; scrolling `DrawerBody` |
| `Alert` (+ Title/Description/Icon) | alert.tsx | Inline, 4 semantic variants |
| `Popconfirm` (+ Trigger/Content/Title/Description/Actions) | popconfirm.tsx | Confirmation bubble |
| `LoadingOverlay` | loading-overlay.tsx | Full-screen or container-scoped |
| `Watermark` | watermark.tsx | Tiled SVG pattern, low opacity |
| `Toaster` + `toast()` | toaster.tsx | sonner-based, themed |

### Toast Usage

```tsx
import { toast } from "@/components/ui/toaster";

toast("Task created.");
toast.success("Synced 12 tasks.");
toast.error("Network error.", { description: "Please retry." });
toast.promise(api.save(), {
  loading: "Saving...",
  success: "Saved.",
  error: "Failed.",
});
```

### Confirm Dialog Pattern

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="danger">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete task?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Overflow Inside a Dialog or Drawer

A dialog and a drawer are both a `flex flex-col` shell with a viewport-derived `max-height` (`calc(100dvh - 2rem)` for the dialog, so its `p-4` wrapper stays clear; `calc(100dvh - 1rem)` for the drawer, matching its 8px inset). Wrap the middle of the panel in `DialogBody` / `DrawerBody` and the three regions behave:

| Region | Behaviour |
| --- | --- |
| `DialogHeader` / `DrawerHeader` | `shrink-0` — pinned, never squeezed |
| `DialogBody` / `DrawerBody` | `flex-1 min-h-0 overflow-y-auto` — takes the leftover height and scrolls |
| `DialogFooter` / `DrawerFooter` | `shrink-0` — actions stay on screen |

```tsx
<DialogContent>
  <DialogHeader>…</DialogHeader>
  <DialogBody>{/* form, long text, … */}</DialogBody>
  <DialogFooter>…</DialogFooter>
</DialogContent>
```

`min-h-0` is the load-bearing class. A flex item defaults to `min-height: auto`, which means it refuses to shrink below its content — without it the body grows the panel instead of scrolling, and anything after it (the footer, and the last few form fields) is pushed off the bottom of the screen. This is what previously happened when a `resize-y` `Textarea` was dragged tall inside a modal: the field could not be constrained, so the panel grew with it.

The shells also carry `overflow-y-auto` themselves, purely as a fallback: content that is *not* wrapped in a body scrolls inside the panel as a whole rather than being clipped. With a body in place the body absorbs the overflow, so the shell never scrolls and the two containers never fight.

`AlertDialog` takes the same viewport cap but has no body region — a confirmation long enough to overflow scrolls as one piece, which is the right trade for a dialog this short.

---

## 8. Media & Content

| Component | File | Notes |
|---|---|---|
| `Image` | image.tsx | Lazy loading, error fallback, blur/skeleton placeholder, `rounded` prop |
| `Avatar` (upload + cropper) | avatar.tsx | For cropper, integrate `react-easy-crop` in a `Dialog` |
| `Markdown Renderer` | Not bundled | Recommended: [`react-markdown`](https://github.com/remarkjs/react-markdown) + [`rehype-highlight`](https://github.com/rehypejs/rehype-highlight) |
| `CodeBlock` / Syntax Highlighter | Not bundled | Recommended: [`shiki`](https://github.com/shikijs/shiki) for SSR, [`prism-react-renderer`](https://github.com/FormidableLabs/prism-react-renderer) for client |
| `Video` / `Audio Player` | Not bundled | Use native `<video controls>` or [`react-player`](https://github.com/cookpete/react-player) |
| `PDF Viewer` | Not bundled | Use [`react-pdf`](https://github.com/wojtekmaj/react-pdf) |
| `Rich Text Editor` | Not bundled | Recommended: [`Tiptap`](https://tiptap.dev/) or [`Lexical`](https://lexical.dev/) |

The library deliberately keeps media handling lean — these dependencies are heavy and project-specific. The included `Image` component gives you the common cases (lazy load, fallback, aspect ratio).

---

## 9. Advanced / Composite

### 9.1 Combobox

`Combobox` is a single-select field with type-to-filter search. Reach for it over `Select` whenever the list is long enough that scrolling to find an option is annoying (projects, assignees, time zones); `Select` stays the better pick for short fixed lists, where the extra typing step buys nothing.

```tsx
const [project, setProject] = React.useState("orkest");

<Combobox
  value={project}
  onValueChange={setProject}
  placeholder="Select a project"
  searchPlaceholder="Search projects..."
  emptyText="No project found."
  options={[
    { value: "orkest", label: "Orkest", description: "Main project", icon: <Folder /> },
    { value: "reading", label: "Reading list", keywords: ["books"] },
    { value: "archived", label: "2025 archive", disabled: true },
  ]}
/>
```

Picking an option closes the panel, the current selection is highlighted when the panel opens, and typing filters on `label` plus whatever `keywords` you attach.

- **Form value** — the trigger is a `PickerTrigger`, so the value rides a hidden `<input>`. Add `name` and it submits inside a plain `<form>`; with `react-hook-form`, drive `value` / `onValueChange` from a `Controller`.
- **Sizing** — omit `size` to follow the global density tier, or pass `size="xs" | "sm" | "md" | "lg"` to pin it. Radius lives in the size variant, so the compact tier stays a rounded rectangle rather than collapsing into a capsule.
- **Inside a Dialog** — like the pickers, the panel re-targets its portal to the nearest dialog so the scroll lock does not clip it.
- **Keyboard** — `Enter` / `Space` / `ArrowDown` open the panel; arrows move, `Enter` selects, `Esc` closes and returns focus to the trigger.

Not included: chips in the trigger (multi-select shows a comma-joined summary), reordering selected values, and a maximum-selection cap.

#### Multi-select and creating

`multiple` turns the selection into a toggle and keeps the panel open — closing after each pick works against the user when the point is to pick several. `value` / `onValueChange` become arrays, and the trigger summarises the selection as `First, Second +N`.

`creatable` adds a trailing row that mints an option out of the typed text, which is what turns the picker into a tag input. The row only appears when the query is non-empty and matches no existing label *exactly*, so it never competes with a real option.

```tsx
const [tags, setTags] = React.useState<string[]>(["design"]);

<Combobox
  multiple
  creatable
  value={tags}
  onValueChange={setTags}
  createText={(typed) => `Create "${typed}"`}
  onCreate={(typed) => createTagOnServer(typed).id}  // omit to use the text as the value
  options={[
    { value: "design", label: "Design" },
    { value: "eng", label: "Engineering" },
  ]}
/>
```

- **`onCreate`** — called with the typed text; return a string to use as the new value (a server id), or nothing to use the text as both value and label.
- **Created options are remembered** — they are kept beside `options`, so a created label survives the next refetch and the trigger stays labelled. A value that later appears in `options` defers to the server's row.
- **Composition** — a panel can be `multiple` *and* a remote search at the same time; the async props above are orthogonal.

The `value` / `onValueChange` types come from the `multiple` flag through a discriminated union, so callers never narrow by hand (`ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps`). Internally both modes share one normalized `string[]` state.

#### Async / remote search

Combobox never fetches anything itself — that belongs to your data layer (React Query, SWR, a server action). What it does offer is the four props that let a request be plugged in without fighting the internals:

| Prop | Why it is needed |
| --- | --- |
| `shouldFilter={false}` | Without it cmdk applies its own matcher to a page the server has *already* filtered, and the list usually goes empty. |
| `searchValue` + `onSearchValueChange` | Take the query over so it can be debounced and sent. The query is cleared on close, so a controlled caller should write the value straight back. The reset fires only when the box is non-empty, so every call reports a query that actually changed — a caller that flips a `loading` flag on this signal cannot be left spinning by a no-op close. |
| `loading` (+ `loadingText`) | Replaces the whole list with a spinner row. The previous page is deliberately *not* left visible underneath — a spinner above live-looking results has no way to say which rows are current, so it reads as a bug rather than as progress. |
| `selectedOption` | Keeps the trigger labelled when `value` is not part of the page currently in `options` — the normal case on an edit form. |

Request ordering stays on your side: abort the superseded request, or ignore the response that arrives out of turn.

```tsx
const [query, setQuery] = React.useState("");
const { data = [], isFetching } = useQuery(searchProjects(query));

<Combobox
  options={data}
  value={projectId}
  onValueChange={setProjectId}
  selectedOption={savedProject}   // value not in `data` yet — still labelled
  shouldFilter={false}            // server already filtered
  searchValue={query}
  onSearchValueChange={setQuery}
  loading={isFetching}
/>
```

The showcase (`FormsSection` → "Async search (Combobox)") runs the same shape against a debounced `setTimeout` stand-in for an endpoint, so the loading and label-resolution behaviour can be seen without a backend.

`CommandLoading` (in `command.tsx`) is the row used for the spinner. cmdk gives it no trigger of its own — render it conditionally, in place of the list. It follows the density tier and takes its `aria-label` from a string child. Note that cmdk wraps the children in an unclassed inner `<div>`, and Tailwind's preflight makes `svg` a block element, so the spinner/label row has to be laid out on that inner wrapper rather than on the element the caller styles.

### 9.2 Segmented Control

Use `ToggleGroup` from `@radix-ui/react-toggle-group` (add it to `package.json` — it is not shipped today). Style inline or build a small wrapper.

### 9.3 FilterBar / QueryFilter

Compose `Input` (search) + `Select` (filter) + `DatePicker` (range) inside a `Flex` container.

### 9.4 ProTable / EditableTable

Use the `Table` primitive + `react-hook-form` for editable cells. Each row is a `FormField` group.

### 9.5 Schema Form / Form Generator

Drive forms from a Zod schema:

```tsx
const schema = z.object({
  name: z.string(),
  age: z.number(),
});
// Iterate schema.shape to render FormField per property.
```

### 9.6 PageHeader

Compose `Heading` + `Text` + actions:

```tsx
<header className="flex items-center justify-between border-b border-border pb-6">
  <div>
    <Heading level="h2">Tasks</Heading>
    <Text variant="muted">Manage your weekly schedule</Text>
  </div>
  <Button>+ New</Button>
</header>
```

### 9.7 StatisticCard / DashboardCard

Provided by `statistic.tsx` — wraps a `Statistic` in a `Card` with optional icon and trend.

### 9.8 ChatBubble / Message List

Not built in. Compose with `Avatar` + `Card` + `Flex` direction-aware.

### 9.9 Kanban / Board

Not built in. Compose with `Flex` (columns) + `Stack` (cards per column) + drag library of choice (e.g., [`@dnd-kit/core`](https://github.com/clauderic/dnd-kit)).

### 9.10 Infinite Scroll / LoadMore

Use `useIntersectionObserver`:

```tsx
const ref = useRef(null);
const entry = useIntersectionObserver(ref, { rootMargin: "200px" });
useEffect(() => {
  if (entry?.isIntersecting && hasNextPage) fetchNextPage();
}, [entry, hasNextPage]);
```

### 9.11 PullToRefresh (mobile)

Not built in. Use [`@ecomfe/react-pull-refresh`](https://github.com/ecomfe/react-pull-refresh) or implement with touch events + `useDebounce`.

---

## 10. Utilities & Hooks

### Hooks (`hooks/`)

| Hook | File | Purpose |
|---|---|---|
| `useAppTheme` | theme-provider.tsx | theme, resolvedTheme, toggleTheme, highContrast |
| `useBreakpoint` | use-breakpoint.ts | current breakpoint name, `useIsMobile()` |
| `useMediaQuery` | use-media-query.ts | SSR-safe boolean |
| `useClickOutside` | use-click-outside.ts | with `ignoreRefs` option |
| `useClipboard` | use-clipboard.ts | copy + copied state |
| `useDebounce` / `useDebouncedCallback` | use-debounce.ts | value + callback variants |
| `useLocalStorage` | use-local-storage.ts | JSON, cross-tab sync |
| `useScrollLock` | use-scroll-lock.ts | body scroll lock, scrollbar compensation |
| `useFocusTrap` | use-focus-trap.ts | Tab/Shift+Tab cycling |
| `useIntersectionObserver` | use-intersection-observer.ts | SSR-safe |
| `useVirtualList` | use-virtual-list.ts | minimal windowing, `scrollToIndex` |
| `useControllableState` | use-controllable-state.ts | controlled/uncontrolled |
| `useId` | use-id.ts | stable id with prefix |

### Utility Functions (`lib/utils.ts`)

`cn` (clsx + tailwind-merge) · `hexToRgb` · `hexToRgba` · `softColorTriple` · `formatNumber` · `formatCurrency` · `formatDate` · `formatRelativeTime` · `uid` · `sleep` · `clamp` · `debounce` · `throttle` · `isNil` · `pick` · `omit`.

### Command-style APIs

- `toast(...)` — imperative toasts (toaster.tsx)
- Modal/Dialog can be made imperative by wrapping in a context provider — recipe in roadmap.

---

## 11. Theming & Customization

### 11.1 Theme Object Structure

See `lib/tokens.ts` — exports `ThemeTokens` interface + `lightTokens` + `darkTokens` + `themes` registry.

### 11.2 CSS Variables Export

All tokens in `app/globals.css` are CSS variables. Use `tokensToCssVars(tokens)` to convert a `ThemeTokens` object to a flat `{ [varName]: value }` record for runtime injection.

### 11.3 Theme Switching

Three modes: Light / Dark / High-Contrast (the last composes on top of either).

```tsx
import { ThemeProvider, useAppTheme } from "@/components/theme-provider";

// In root layout:
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>

// Anywhere in the app:
const { isDark, toggleTheme, toggleHighContrast } = useAppTheme();
```

### 11.4 Component-Level Overrides

Three layers (in order of increasing specificity):

1. **className** — passed to every component, merged last via `cn()`. Wins over defaults.
2. **style** — inline styles, supported on all DOM-wrapping components.
3. **Slots** — compound components accept child elements for sub-parts (e.g., `Dialog` accepts `DialogHeader`, `DialogFooter`).

For deeper customization, **copy the component source** into your project and modify — that's the shadcn philosophy.

### 11.5 Design Token Export

- JSON: `JSON.stringify(lightTokens, null, 2)` from `lib/tokens.ts`.
- CSS: already in `app/globals.css`.
- SCSS / Style Dictionary: pipe the JSON through [Style Dictionary](https://amzn.github.io/style-dictionary/).

### 11.6 Multi-Brand / Multi-Tenant

Inject a custom `ThemeTokens` object at runtime:

```tsx
const brandTokens = { ...lightTokens, colors: { ...lightTokens.colors, accent: "#6366f1" } };

<div style={tokensToCssVars(brandTokens)}>
  <App />
</div>
```

CSS variables cascade naturally, so per-tenant theming is just a wrapper.

### 11.7 Tailwind Compatibility

Tokens are exposed as Tailwind theme extensions (see `tailwind.config.ts`). All standard utilities work: `bg-background`, `text-foreground-muted`, `border-border-strong`, `shadow-pop`, `rounded-2xl`, etc.

### 11.8 CSS-in-JS / CSS Modules / UnoCSS

The library is Tailwind-native. To use with CSS Modules, copy the source and replace Tailwind classes with module references. UnoCSS users can use the [`@unocss/preset-typography`](https://unocss.dev/) + custom rules mapping to the same CSS variables.

---

## 12. Accessibility

### 12.1 ARIA Support

- All interactive components use Radix UI primitives, which provide full ARIA out of the box.
- Custom components (`Spinner`, `Skeleton`, `Divider`, etc.) include appropriate `role`, `aria-label`, `aria-orientation`, `aria-valuenow`, etc.

### 12.2 Keyboard Navigation

- All Radix components are fully keyboard-accessible (Tab, Shift+Tab, Arrow keys, Escape, Enter/Space).
- `useFocusTrap` is provided for custom overlays.
- `:focus-visible` rings are styled globally (2px solid `--ring`, 2px offset).

### 12.3 Screen Reader Compatibility

- Semantic HTML first (`<nav>`, `<button>`, `<dialog>`, `<table>`, etc.).
- Decorative icons get `aria-hidden`. Interactive icons get `aria-label`.
- Live regions: `toast` uses `role="status"`. Loading spinners use `role="status"` + `aria-live="polite"`.

### 12.4 High Contrast Mode

`html.high-contrast` (composable with `html.dark`) overrides all tokens:
- Borders become pure black/white.
- Backgrounds become pure white/black.
- Semantic colors use browser-safe hues.
- Shadows become solid outlines.

Toggle via `useAppTheme().toggleHighContrast()`.

### 12.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Already in `app/globals.css`.

### 12.6 Focus Visibility

`:focus-visible` (keyboard-only) shows a 2px ring. `:focus` (mouse) does not, to avoid noise.

### 12.7 Semantic HTML

The library prefers semantic elements: `<nav>` (Breadcrumb), `<ol>` (Steps), `<table>` (Table), `<dialog>` (Dialog), `<button>` (Button). The `asChild` pattern lets you render any element you need.

---

## 13. i18n & l10n

### 13.1 Built-in Copy

Components have minimal hard-coded copy (e.g., `Empty`'s default "No data"). Override via props (`title`, `description`).

### 13.2 Date / Number / Currency Formatting

Use helpers from `lib/utils.ts`:

```tsx
formatNumber(1234567.89, "en-US");                          // "1,234,567.89"
formatCurrency(99.5, "USD", "en-US");                        // "$99.50"
formatDate(new Date(), "en-US", { dateStyle: "long" });      // "July 26, 2026"
formatRelativeTime(Date.now() - 3600_000, "en");             // "1 hour ago"
```

All use `Intl.NumberFormat` / `Intl.DateTimeFormat` / `Intl.RelativeTimeFormat` under the hood.

### 13.3 RTL Support

- `[dir="rtl"]` is recognized globally (in `globals.css`).
- Tailwind's `rtl:` / `ltr:` variants work out of the box.
- For icon directionality (e.g., back/forward arrows), use `ArrowLeft` vs `ArrowRight` based on `document.dir` or your i18n library.

### 13.4 Built-in ZH/EN Language Switching

The project ships with a lightweight i18n layer — no external dependency required.

**Source**: `lib/i18n.ts` (dictionary) + `components/language-provider.tsx` (context + hooks).

- `LanguageProvider` wraps the app in `app/layout.tsx`.
- Persists the choice to `localStorage` under `orkest-lang`.
- Updates `<html lang>` for accessibility / SEO.
- Hydration-safe: renders `zh` on the server and first paint, then syncs from `localStorage` after mount.

```tsx
import { useT, useLang, useLanguage } from "@/components/language-provider";

function Example() {
  const t = useT();           // translation function: t("nav.colors") → "色彩" / "Colors"
  const lang = useLang();     // current language: "zh" | "en"
  const { setLang, toggleLang } = useLanguage();

  return (
    <>
      <p>{t("hero.title1")}</p>
      <button onClick={toggleLang}>Switch to {lang === "zh" ? "EN" : "中"}</button>
    </>
  );
}
```

To add a new string:

1. Add the key under both `zh` and `en` in `lib/i18n.ts`.
2. Use `t("section.key")` in any client component.

For larger apps, you can pair this with [`next-intl`](https://github.com/amannn/next-intl) or [`react-i18next`](https://github.com/i18next/react-i18next) and pass translated strings as props to atoms like `Empty`:

```tsx
<Empty
  title={t("empty.title")}
  description={t("empty.description")}
/>
```

---

## 14. Docs & DX

### 14.1 Component Documentation

This document (`docs/design-system.md`) is the canonical reference. Each component file also has TSDoc comments on its props.

### 14.2 API Documentation (Props Tables)

Use [`react-docgen-typescript`](https://github.com/styleguidist/react-docgen-typescript) to auto-generate props tables from the .tsx files. All components export their props interfaces (e.g., `ButtonProps`, `InputProps`).

### 14.3 Interactive Playground

Recommended: [Storybook 8](https://storybook.js.org/) with the `@storybook/nextjs` framework. A starter config is on the roadmap. Each story:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "ghost", "danger", "subtle", "link"] },
    size: { control: "select", options: ["sm", "md", "lg", "icon", "fab"] },
  },
};
export default meta;

export const Default: StoryObj<typeof Button> = {
  args: { children: "Click me", variant: "default", size: "md" },
};
```

### 14.4 Design Spec (Figma Mapping)

Token names in code match Figma variable names 1:1 (`--background` ↔ `background`, `--blue` ↔ `blue`, etc.). Import `lib/tokens.ts` JSON output into Figma via [Tokens Studio](https://tokens.studio/).

### 14.5 Changelog / Migration Guide

Use [`changesets`](https://github.com/changesets/changesets) for versioning + auto-generated changelogs.

### 14.6 State Matrix

Every component documents its states via variants:
- **Loading**: `Spinner` inside button, `Skeleton` for content, `LoadingOverlay` for screens.
- **Disabled**: `disabled` prop universally supported, renders `opacity-50 pointer-events-none`.
- **Error**: `Input`/`Textarea` have `error` variant; `Alert` variant="error"; `FormMessage` shows errors.
- **Empty**: `Empty` component, `TableEmpty` for tables, `CommandEmpty` for command palette.

### 14.7 Code Examples (Copy Button)

Use the shadcn [registry format](https://ui.shadcn.com/docs/registry) to expose copyable code snippets per component.

### 14.8 Live Theme Switcher

Built-in via `useAppTheme()`. A toggle button:

```tsx
<Button variant="outline" size="icon" onClick={toggleTheme}>
  <Icon as={isDark ? Sun : Moon} />
</Button>
```

### 14.9 Accessibility Reports

Run [`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm) in CI:

```bash
npx @axe-core/playwright --tags wcag2a,wcag2aa,wcag21aa
```

---

## 15. Engineering & Quality

### 15.1 Unit + Snapshot Tests

- Framework: [Vitest](https://vitest.dev/) + [`@testing-library/react`](https://testing-library.com/).
- Snapshot tests for stable presentational components.
- Behavior tests for interactive components (open/close, focus, keyboard).

### 15.2 Visual Regression

- [Chromatic](https://www.chromatic.com/) (Storybook add-on) or [Percy](https://percy.io/).
- [Playwright](https://playwright.dev/) for end-to-end visual snapshots.

### 15.3 Accessibility Automation

- [`axe-core`](https://github.com/dequelabs/axe-core) via `@axe-core/playwright` in CI.
- Lighthouse CI for overall a11y score.

### 15.4 Performance Monitoring

- Bundle size: [`@next/bundle-analyzer`](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer).
- Render perf: React DevTools Profiler + [`why-did-you-render`](https://github.com/welldone-software/why-did-you-render).
- All components are tree-shakeable (no side-effectful top-level code, `"use client"` only where needed).

### 15.5 Tree-shakeable Packaging

Each component is a separate ESM module. Importing one component does not pull others:

```tsx
import { Button } from "@/components/ui/button"; // pulls only button.tsx
```

### 15.6 Multi-Format Output

This library is designed for **source copy-paste** (shadcn style). If you need a published package, configure [`tsup`](https://tsup.egoist.dev/) for ESM + CJS + types output.

### 15.7 TypeScript

- Full types for every component, prop, and variant.
- `strict: true` enabled in `tsconfig.json`.
- Run `npm run typecheck` to verify.

### 15.8 Styling Strategy

**Primary**: Tailwind CSS with CSS variables. This is the only officially supported approach.

**Alternatives** (community-supported):
- CSS Modules: copy source, replace `className="bg-surface"` with `className={styles.surface}`.
- CSS-in-JS (emotion, styled-components, vanilla-extract): wrap components in styled() and reference CSS variables.
- UnoCSS: use `@unocss/preset-wind` + custom rules mapping to the same CSS variables.

### 15.9 Auto-import

Use [`unplugin-auto-import`](https://github.com/unplugin/unplugin-auto-import) with a custom resolver for `@/components/ui/*`:

```ts
AutoImport({
  resolvers: [
    (name) => {
      if (/^(Button|Input|Dialog|...)$/.test(name)) {
        return { name, from: `@/components/ui/${name.toLowerCase()}` };
      }
    },
  ],
});
```

### 15.10 Monorepo

If splitting into multiple packages, use [Turborepo](https://turbo.build/repo) + [pnpm workspaces](https://pnpm.io/workspaces). Recommended package split:

- `@orkest/tokens` — `lib/tokens.ts` + CSS exports
- `@orkest/react` — components
- `@orkest/hooks` — hooks
- `@orkest/utils` — `lib/utils.ts`

### 15.11 Versioning + Semver Release

- [`changesets`](https://github.com/changesets/changesets) for versioning + changelog.
- Follow SemVer: major for breaking token changes, minor for new components, patch for fixes.

### 15.12 Peer Dependencies

Declared in `package.json`:

- `react` ^18 || ^19
- `react-dom` ^18 || ^19
- `next` ^14 || ^15 (optional, only for `next/font` + `next/link` integration)
- `tailwindcss` ^3.4

---

## 16. Often-Overlooked

### 16.1 Error Boundaries

Wrap your app in a React Error Boundary that renders a `Result` with `status="500"`:

```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <Result status="500" title="Something went wrong" subtitle="Please refresh." />;
    }
    return this.props.children;
  }
}
```

### 16.2 Empty / Loading / Error State Design Language

| State | Component | Styling |
|---|---|---|
| Loading | `Spinner`, `Skeleton`, `SkeletonText`, `LoadingOverlay` | `animate-pulse-soft`, `bg-hover-bg-strong` |
| Empty | `Empty`, `TableEmpty`, `CommandEmpty` | dashed border, centered, muted text |
| Error | `Alert variant="error"`, `Result status="error"` | `red-soft` bg, `red-border` border, `red` text |

### 16.3 Mobile / Touch Support

- All interactive components have at least 40×40px hit areas (Button sm = 36px, acceptable for tight mobile UIs).
- `Drawer side="bottom"` for mobile sheets.
- `useIsMobile()` hook for conditional rendering.
- Pull-to-refresh: see section 9.11.

### 16.4 Print Styles

In `app/globals.css`:

```css
@media print {
  .no-print { display: none !important; }
  body { background: #fff !important; color: #000 !important; }
}
```

Use `<div className="no-print">` on UI chrome you don't want in printouts.

### 16.5 SSR / RSC Compatibility

- All components work in Next.js App Router server components unless marked `"use client"`.
- Files marked `"use client"`: any component using hooks, event handlers, or browser APIs (Dialog, Tooltip, Select, etc.).
- Pure presentational components (`Card`, `Badge`, `Typography`, `Divider`, etc.) are RSC-safe.

### 16.6 Micro-frontend Style Isolation

- Use [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) for hard isolation.
- Or use CSS-scoping via [`@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) — Orkest tokens are already in `@layer base`.
- For multi-tenant runtime themes, scope via a wrapper `<div style={tokensToCssVars(brandTokens)}>`.

### 16.7 Usage Guidelines & Anti-patterns

**Do**:
- Compose small components rather than customizing one big component.
- Use `cn()` to merge classes (later classes win).
- Pass `className` for overrides; use `asChild` to swap the underlying element.
- Trust Radix for keyboard/ARIA; don't reimplement.

**Don't**:
- Don't `!important` over tokens — override the CSS variable instead.
- Don't render a `Dialog` inside another `Dialog` — use `Drawer` or `AlertDialog` for nested flows.
- Don't put interactive elements inside `Tooltip` — use `Popover` instead.
- Don't rely on `:hover` alone — always provide a keyboard equivalent.

### 16.8 Contribution Guide / Token Update Flow

1. Edit tokens in `app/globals.css` (CSS) AND `lib/tokens.ts` (TypeScript) — keep in sync.
2. Update `tailwind.config.ts` if you added a new token name.
3. Run `npm run typecheck`.
4. Add a Changeset: `npx changeset`.
5. Open a PR.

### 16.9 Design Resource Sync (Figma / Sketch / XD)

- Export `lib/tokens.ts` as JSON.
- Import into [Tokens Studio for Figma](https://tokens.studio/) — variables map 1:1.
- Use the official [shadcn Figma kit](https://www.figma.com/community/file/1260205111872998480) as a base, then apply Orkest tokens.

### 16.10 Icon Library Management

- Source: [`lucide-react`](https://lucide.dev/) — versioned via `package.json`.
- Updates are non-breaking (additive) — safe to bump minor.
- For custom icons, use `Icon` wrapper with your own SVG component.

### 16.11 Animation Library Integration

- **CSS-only** (default): all motion is CSS keyframes in `app/globals.css` — zero JS overhead.
- **Framer Motion**: install [`framer-motion`](https://www.framer.com/motion/) for advanced scenarios. Use sparingly — most UI motion should be CSS.
- **Motion One**: [`motion`](https://motion.dev/) — lighter alternative to Framer.

### 16.12 Virtual Scrolling / Large Data

Use `useVirtualList` for lists >1000 items. For tables, consider [`@tanstack/react-table`](https://tanstack.com/table/v8) with row virtualization.

### 16.13 Security

- **XSS**: React escapes all interpolated content by default. For `dangerouslySetInnerHTML` (e.g., markdown), sanitize with [`DOMPurify`](https://github.com/cure53/DOMPurify).
- **Upload validation**: validate MIME type + size on the client (UX) AND server (security). Never trust client-only validation.
- **URL params**: sanitize before rendering — use [`isomorphic-dompurify`](https://github.com/kkomelin/isomorphic-dompurify) for SSR.

---

## Reference

- **Foundation**: `app/globals.css` · `tailwind.config.ts` · `lib/utils.ts` · `lib/tokens.ts`
- **Components**: `components/ui/` (71 files, ~11,000 lines)
- **Hooks**: `hooks/` (12 files)
- **Theme**: `components/theme-provider.tsx` · `components/density-provider.tsx`
- **Config**: `components.json` · `package.json` · `tsconfig.json`

**Component count**: 71 files under `components/ui/` · 12 hooks · 4 lib modules.

---

*Orkest UI · Built with care for developers who care about details.*
