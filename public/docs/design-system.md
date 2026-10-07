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

**Semantic colors** (light / dark):
- Blue `#2563eb` / `#93c5fd` — info, "medium" priority
- Orange `#ea580c` / `#fdba74` — warning, "high" priority
- Red `#dc2626` / `#fca5a5` — error, "urgent" priority
- Green `#16a34a` / `#86efac` — success
- Yellow `#ca8a04` / `#fde047` — caution

Each semantic color ships with `-soft` (background tint) and `-border` (matching border) variants, both auto-adjusted for dark mode (rgba-based for translucency).

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

---

## 2. Atoms

The lowest-level reusable units. Located in `components/ui/`.

| Component | File | Variants / Notes |
|---|---|---|
| `Button`, `ButtonGroup` | button.tsx | variants: default/outline/ghost/danger/subtle/link; sizes: sm/md/lg/icon/icon-sm/fab; loading state; `asChild` via Slot |
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
| `Tooltip` | tooltip.tsx | Radix Tooltip, 300ms delay, theme-aware bubble |
| `Popover` | popover.tsx | Radix Popover, `shadow-pop` |
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
| `Input`, `InputWithIcon`, `PasswordInput` | input.tsx | Variants (default/error), sizes (sm/md/lg), Eye toggle for password |
| `Textarea` | textarea.tsx | `rounded-xl`, optional `showCount` character counter |
| `Select` (+ all sub-components) | select.tsx | Radix Select, check indicator, scroll buttons |
| `Checkbox`, `CheckboxGroup` | checkbox.tsx | Check / Minus (indeterminate), group with `onValueChange` |
| `RadioGroup`, `RadioGroupItem`, `RadioCard` | radio-group.tsx | Standard + card-style selectable |
| `Switch` | switch.tsx | Radix Switch |
| `Slider`, `RangeSlider` | slider.tsx | Radix Slider, multi-thumb support |
| `InputNumber` | input-number.tsx | +/- buttons, min/max/step, clamp |
| `InputOTP` (+ Group/Slot/Separator) | input-otp.tsx | Verification codes |
| `PasswordStrength` | password-strength.tsx | 0-4 strength meter + checklist |
| `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` | form.tsx | react-hook-form + zod integration |

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

- **DatePicker / TimePicker / DateRangePicker**: Use `Calendar` (built on `react-day-picker`) wrapped in a `Popover`. A complete recipe is in the roadmap.
- **Upload / Cropper**: Out of scope — integrate [`react-dropzone`](https://github.com/react-dropzone/react-dropzone) + [`react-easy-crop`](https://github.com/ValentinH/react-easy-crop).
- **ColorPicker**: Use [`react-colorful`](https://github.com/omgovich/react-colorful).
- **Cascader / TreeSelect / Transfer / Mentions / AutoComplete / Combobox**: Build with `Popover` + `Command` (cmdk) primitives. See section 9.

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
| `Card` (+ Header/Title/Description/Content/Footer/Action) | card.tsx | `hoverable` prop |
| `Table` (+ Header/Body/Footer/Row/Head/Cell/Caption/Empty) | table.tsx | Native `<table>`, hoverable rows, `data-[state=selected]` |
| `List` (+ Item/Separator) | list.tsx | density: compact/default/comfortable |
| `Empty` (+ Icon/Title/Description/Actions) | empty.tsx | Dashed border, centered |
| `Result` (+ Icon/Title/Subtitle/Actions) | result.tsx | success/error/warning/info/404/403/500 |
| `Statistic` (+ Label/Value/Suffix/Prefix/Trend) | statistic.tsx | Plus `StatisticCard` wrapper |
| `Timeline` (+ Item/Separator/Dot/Content/Title/Description/Time) | timeline.tsx | Vertical timeline with colored dots |
| `Accordion` (+ Item/Trigger/Content) | accordion.tsx | Radix Accordion, animated expand |
| `Calendar` | calendar.tsx | react-day-picker, single/range/multiple modes |
| `Image` | image.tsx | Lazy load, fallback, skeleton placeholder |
| `Carousel` (+ Content/Item/Previous/Next) | carousel.tsx | embla-carousel-react |
| `QRCode` | qrcode.tsx | Pure SVG (no dependency) |
| `Descriptions` (+ Item/Label/Content) | descriptions.tsx | Key-value list, responsive |

### Table Pattern

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
| `Dialog` (+ Trigger/Overlay/Content/Header/Footer/Title/Description/Close) | dialog.tsx | Radix Dialog, `rounded-2xl`, `shadow-dialog`, focus trap |
| `AlertDialog` (+ full compound) | alert-dialog.tsx | Compact confirmation, destructive action |
| `Drawer` | drawer.tsx | Side: left/right/top/bottom, slide-in |
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

### 9.1 Combobox / AutoComplete

Build using `Popover` + `Command`:

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" role="combobox">
      {value ? options.find(o => o.value === value)?.label : "Select..."}
      <Icon as={ChevronsUpDown} />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-72 p-0">
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No result.</CommandEmpty>
        {options.map(o => (
          <CommandItem key={o.value} onSelect={() => setValue(o.value)}>
            {o.label}
            <Icon as={Check} className={cn("ml-auto", value === o.value ? "opacity-100" : "opacity-0")} />
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

### 9.2 Segmented Control

Use `ToggleGroup` from `@radix-ui/react-toggle-group` (already in `package.json`). Style inline or build a small wrapper.

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
- **Components**: `components/ui/` (63 files)
- **Hooks**: `hooks/` (12 files)
- **Theme**: `components/theme-provider.tsx`
- **Config**: `components.json` · `package.json` · `tsconfig.json`

**Component count**: 63 components · 12 hooks · 4 lib modules · ~2,800 lines of TypeScript/CSS.

---

*Orkest UI · Built with care for developers who care about details.*
