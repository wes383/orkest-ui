# Orkest UI

> Elegant, minimal, modern component library for Next.js.
> shadcn/ui style — source is meant to be copied into your project.
> Built on Radix UI primitives, Tailwind CSS, and lucide-react icons.

**Aesthetic**: warm minimal. Off-white backgrounds, refined neutral foreground, generous pill-shaped radii, low-contrast borders, three carefully paired fonts (Manrope display, Inter body, JetBrains Mono code).

---

## Highlights

- **70+ components** in `components/ui/` — forms, overlays, data display, navigation, feedback, and utility primitives.
- **Three theme modes** — Light, Dark, and High Contrast, with runtime switching and persistence via CSS variables.
- **Token-driven design** — single source of truth in `app/globals.css`, mirrored to TypeScript in `lib/tokens.ts`, and mapped to Tailwind in `tailwind.config.ts`.
- **i18n-ready** — built-in `zh` / `en` dictionary and `LanguageProvider` with SSR-safe first paint.
- **Accessibility-first** — full ARIA support, keyboard navigation, and focus management built on Radix UI.
- **SSR / RSC friendly** — all client-only components are marked `"use client"`.
- **Copy-paste ownership** — no runtime dependency on `orkest-ui`; you own every file you copy in.

---

## Getting Started

### Prerequisites

- Node.js 18+
- React 18 or 19

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the component showcase.

## Using Components

### Option 1 — Copy the source

This library follows the shadcn/ui philosophy: copy the files you need into your project and own them.

```bash
# Install peer dependencies
npm install class-variance-authority clsx tailwind-merge \
  @radix-ui/react-* lucide-react next-themes sonner cmdk \
  embla-carousel-react react-day-picker input-otp \
  react-resizable-panels react-hook-form @hookform/resolvers zod
```

Then copy the relevant files from `components/ui/`, `hooks/`, and `lib/` into your project.

### Option 2 — shadcn CLI

A `components.json` is included for the shadcn CLI:

```bash
npx shadcn@latest init
npx shadcn@latest add button input dialog
```

### Example

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Example() {
  return (
    <div className="flex gap-2">
      <Input placeholder="Email" />
      <Button>Subscribe</Button>
    </div>
  );
}
```

---

## Theming

Themes are driven entirely by CSS variables, so they switch at runtime with no re-render.

### Three modes

| Mode           | Class on `<html>`              |
| -------------- | ------------------------------ |
| Light          | (none)                         |
| Dark           | `dark`                         |
| High Contrast  | `high-contrast`                |
| Dark + HC      | `dark high-contrast`           |

### ThemeProvider

Wrap your app with `ThemeProvider` (from `components/theme-provider.tsx`). It wraps `next-themes` and exposes a unified `appearance` state to avoid invalid mode combinations during switching.

```tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }) {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
```

### Customizing tokens

Edit the CSS variables in `app/globals.css` — every component reads from them. If you also consume tokens from JS (Style Dictionary, Figma sync, runtime injection), keep `lib/tokens.ts` in sync.

---

## Internationalization

The built-in i18n covers `zh` and `en`. The component library itself stays locale-agnostic (English by default); apps look up values via their own dictionary and inject them through props. The showcase uses the bundled dictionary in `lib/i18n.ts`.

```tsx
import { LanguageProvider, useT } from "@/components/language-provider";

export default function RootLayout({ children }) {
  return (
    <LanguageProvider defaultLang="zh">
      {children}
    </LanguageProvider>
  );
}

function MyComponent() {
  const t = useT();
  return <p>{t("nav.colors")}</p>;
}
```

---

## Components

A non-exhaustive list of what's included in `components/ui/`:

- **Forms**: `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `RadioGroup`, `Slider`, `InputOTP`, `InputNumber`, `DatePicker`, `DateRangePicker`, `TimePicker`, `DateTimePicker`, `PasswordStrength`, `Form`, `Label`
- **Overlays**: `Dialog`, `AlertDialog`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu`, `ContextMenu`, `HoverCard`, `Popconfirm`
- **Data display**: `Table`, `Card`, `Avatar`, `Statistic`, `Breadcrumb`, `Pagination`, `Accordion`, `Empty`, `Result`, `Timeline`, `List`, `Descriptions`
- **Navigation**: `Tabs`, `Steps`, `Menu`, `NavigationMenu`, `Pagination`
- **Feedback**: `Alert`, `Toaster`/`Toast`, `Progress`, `CircularProgress`, `Skeleton`, `Spinner`, `LoadingOverlay`
- **Typography**: `Typography`, `Kbd`, `Tag`, `Badge`, `Chip`, `Pill`
- **Layout**: `Container`, `Flex`, `Stack`, `Grid`, `Divider`, `Spacer`
- **Media**: `Image`, `AspectRatio`, `Carousel`, `QRCode`, `Watermark`
- **Utility**: `ScrollArea`, `Resizable`, `Command`, `WheelPicker`

---

## Hooks

Reusable hooks in `hooks/`:

| Hook                        | Purpose                                                |
| --------------------------- | ------------------------------------------------------ |
| `use-controllable-state`    | Controlled / uncontrolled value merging                |
| `use-focus-trap`            | Trap focus within a container (dialogs, menus)         |
| `use-scroll-lock`           | Lock body scroll while an overlay is open              |
| `use-click-outside`         | Fire a callback on outside clicks                      |
| `use-media-query`           | Subscribe to a CSS media query                         |
| `use-breakpoint`            | Current Tailwind breakpoint                            |
| `use-intersection-observer` | Element visibility via IntersectionObserver            |
| `use-clipboard`             | Copy text to clipboard with status                     |
| `use-debounce`              | Debounce a fast-changing value                          |
| `use-local-storage`         | Persisted state with cross-tab sync                    |
| `use-id`                    | SSR-safe unique id                                     |
| `use-virtual-list`          | Virtualize long lists for performance                  |
