/**
 * Orkest UI — Design Tokens (TypeScript export)
 *
 * Single source of truth: `app/globals.css`. This file mirrors the CSS
 * variables so JS-side code (multi-brand theming, Style Dictionary / Figma
 * sync, runtime injection) can read the same values.
 *
 * If you change CSS variables, update this file in sync. The values on both
 * sides must match one-to-one.
 */

/**
 * Theme mode identifiers. Aligned with the `Appearance` union in
 * components/theme-provider.tsx so JS consumers can index `themes` directly
 * with an appearance value.
 */
export type ThemeMode = "light" | "dark" | "light-hc" | "dark-hc";

export interface ColorToken {
  name: string;
  value: string;
  description?: string;
}

export interface SemanticColor {
  /** Main fill color. */
  DEFAULT: string;
  /** Foreground (text) on a soft background. */
  fg: string;
  /** Soft tinted background. */
  soft: string;
  /** Border matching the soft background. */
  border: string;
}

/**
 * A filled surface built from a semantic colour — a destructive button, say —
 * with the text colour that sits on top of it.
 *
 * Kept apart from `SemanticColor.DEFAULT` because that value doubles as the
 * text/icon colour on a neutral background, so in dark mode it is a pale tint
 * that cannot carry light text as a fill.
 */
export interface SolidColor {
  /** Fill of the solid surface. */
  DEFAULT: string;
  /** Fill on hover. */
  hover: string;
  /** Text/icon colour on the fill. */
  fg: string;
}

export interface ThemeTokens {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    sidebar: string;
    muted: string;
    foreground: string;
    foregroundMuted: string;
    foregroundSubtle: string;
    foregroundFaint: string;
    foregroundOnAccent: string;
    border: string;
    borderStrong: string;
    ring: string;
    hoverBg: string;
    hoverBgStrong: string;
    overlay: string;
    accent: string;
    accentHover: string;
    accentFg: string;
    accentMuted: string;
    semantic: {
      blue: SemanticColor;
      orange: SemanticColor;
      /** Only red ships a solid triple — it is the one used as a filled surface. */
      red: SemanticColor & { solid: SolidColor };
      green: SemanticColor;
      yellow: SemanticColor;
    };
    palette: Record<string, string>;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    full: string;
  };
  shadow: {
    xs: string;
    sm: string;
    md: string;
    pop: string;
    dialog: string;
    fab: string;
  };
  typography: {
    fontSans: string;
    fontDisplay: string;
    fontMono: string;
    sizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
      "5xl": string;
    };
    leading: {
      tight: string;
      snug: string;
      normal: string;
      relaxed: string;
    };
    tracking: {
      tight: string;
      normal: string;
      wide: string;
    };
  };
  spacing: Record<string, string>;
  motion: {
    duration: {
      fast: string;
      base: string;
      slow: string;
      slower: string;
    };
    easing: {
      out: string;
      inOut: string;
      spring: string;
    };
  };
  zIndex: {
    base: number;
    dropdown: number;
    sticky: number;
    tooltip: number;
    popover: number;
    modal: number;
    toast: number;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
}

/**
 * 19-color project palette — warm-shifted & desaturated, shared across all
 * theme modes (dark mode does not override palette tokens in globals.css).
 *
 * The type is explicitly declared as `Record<string, string>` so callers can
 * look up by string key (e.g. `PROJECT_PALETTE[userColor]`).
 */
export const PROJECT_PALETTE: Record<string, string> = {
  red: "#c8585a",
  orange: "#cc7344",
  amber: "#c89248",
  yellow: "#bba348",
  lime: "#7d9a48",
  green: "#5d9a5d",
  emerald: "#549770",
  teal: "#4d9088",
  cyan: "#4d8fa8",
  sky: "#5e93b8",
  blue: "#5d83bb",
  indigo: "#7373b3",
  violet: "#8974b3",
  purple: "#9c77ab",
  fuchsia: "#a96fa0",
  pink: "#b8758a",
  rose: "#b56874",
  gray: "#847a7e",
  slate: "#787e85",
};

/** Alias for backward compatibility. */
export const PROJECT_PALETTE_TOKENS = PROJECT_PALETTE;

/* ── Light theme (default) ─────────────────────────────────── */
export const lightTokens: ThemeTokens = {
  mode: "light",
  colors: {
    background: "#fcfbfa",
    surface: "#ffffff",
    sidebar: "#fafaf9",
    muted: "#f3f4f6",
    foreground: "#25242a",
    foregroundMuted: "#6d6770",
    foregroundSubtle: "#9f99a3",
    foregroundFaint: "#b0a9b2",
    foregroundOnAccent: "#ffffff",
    border: "rgba(0, 0, 0, 0.08)",
    borderStrong: "rgba(0, 0, 0, 0.22)",
    ring: "rgba(0, 0, 0, 0.22)",
    hoverBg: "rgba(0, 0, 0, 0.035)",
    hoverBgStrong: "rgba(0, 0, 0, 0.06)",
    overlay: "rgba(0, 0, 0, 0.18)",
    accent: "#25242a",
    accentHover: "#000000",
    accentFg: "#ffffff",
    accentMuted: "rgba(37, 36, 42, 0.08)",
    semantic: {
      blue:   { DEFAULT: "#2563eb", fg: "#1d4ed8", soft: "#eff6ff", border: "#bfdbfe" },
      orange: { DEFAULT: "#ea580c", fg: "#c2410c", soft: "#fff7ed", border: "#fed7aa" },
      red:    { DEFAULT: "#dc2626", fg: "#b91c1c", soft: "#fef2f2", border: "#fecaca",
                solid: { DEFAULT: "#dc2626", hover: "#b91c1c", fg: "#ffffff" } },
      green:  { DEFAULT: "#16a34a", fg: "#15803d", soft: "#f0fdf4", border: "#bbf7d0" },
      yellow: { DEFAULT: "#ca8a04", fg: "#a16207", soft: "#fefce8", border: "#fde68a" },
    },
    palette: { ...PROJECT_PALETTE },
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    full: "9999px",
  },
  shadow: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.04)",
    sm: "0 1px 2px rgba(0, 0, 0, 0.04)",
    md: "0 4px 12px rgba(28, 24, 35, 0.06)",
    pop: "0 20px 45px rgba(28, 24, 35, 0.10)",
    dialog: "0 28px 80px rgba(28, 24, 35, 0.14)",
    fab: "0 18px 45px rgba(37, 36, 42, 0.22)",
  },
  typography: {
    fontSans: "var(--font-inter, 'Inter'), var(--font-noto-sans-sc, 'Noto Sans SC'), 'Noto Sans JP', ui-sans-serif, system-ui, sans-serif",
    fontDisplay: "var(--font-plus-jakarta-sans, 'Plus Jakarta Sans'), var(--font-noto-sans-sc, 'Noto Sans SC'), ui-sans-serif, system-ui, sans-serif",
    fontMono: "var(--font-jetbrains-mono, 'JetBrains Mono'), var(--font-noto-sans-sc, 'Noto Sans SC'), ui-monospace, 'SFMono-Regular', Menlo, monospace",
    sizes: {
      xs: "12px",
      sm: "13px",
      base: "15px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "28px",
      "4xl": "32px",
      "5xl": "40px",
    },
    leading: { tight: "1.1", snug: "1.3", normal: "1.5", relaxed: "1.75" },
    tracking: { tight: "-0.02em", normal: "0", wide: "0.04em" },
  },
  spacing: {
    "0": "0",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px",
    "12": "48px",
    "16": "64px",
    "20": "80px",
    "24": "96px",
  },
  motion: {
    duration: { fast: "0.1s", base: "0.15s", slow: "0.2s", slower: "0.3s" },
    easing: {
      out: "cubic-bezier(0.16, 1, 0.3, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
  },
  zIndex: {
    base: 0,
    dropdown: 40,
    sticky: 30,
    tooltip: 40,
    popover: 50,
    modal: 60,
    toast: 70,
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

/* ── Dark theme ────────────────────────────────────────────── */
export const darkTokens: ThemeTokens = {
  ...lightTokens,
  mode: "dark",
  colors: {
    ...lightTokens.colors,
    background: "#101010",
    surface: "#181818",
    sidebar: "#181818",
    muted: "rgba(255, 255, 255, 0.06)",
    foreground: "#f5f5f5",
    foregroundMuted: "#a3a3a3",
    foregroundSubtle: "#737373",
    foregroundFaint: "#6a6570",
    foregroundOnAccent: "#111111",
    border: "rgba(255, 255, 255, 0.10)",
    borderStrong: "rgba(255, 255, 255, 0.25)",
    ring: "rgba(255, 255, 255, 0.30)",
    hoverBg: "rgba(255, 255, 255, 0.06)",
    hoverBgStrong: "rgba(255, 255, 255, 0.10)",
    overlay: "rgba(0, 0, 0, 0.55)",
    accent: "#f5f5f5",
    accentHover: "#ffffff",
    accentFg: "#111111",
    accentMuted: "rgba(245, 245, 245, 0.10)",
    semantic: {
      blue:   { DEFAULT: "#93c5fd", fg: "#60a5fa", soft: "rgba(59, 130, 246, 0.12)", border: "rgba(96, 165, 250, 0.45)" },
      orange: { DEFAULT: "#fdba74", fg: "#fb923c", soft: "rgba(249, 115, 22, 0.12)", border: "rgba(251, 146, 60, 0.45)" },
      red:    { DEFAULT: "#fca5a5", fg: "#f87171", soft: "rgba(239, 68, 68, 0.12)",  border: "rgba(248, 113, 113, 0.45)",
                // Not inverted with --red: a filled danger surface stays a
                // saturated red so its white label keeps its contrast.
                solid: { DEFAULT: "#dc2626", hover: "#b91c1c", fg: "#ffffff" } },
      green:  { DEFAULT: "#86efac", fg: "#4ade80", soft: "rgba(34, 197, 94, 0.16)",  border: "rgba(74, 222, 128, 0.45)" },
      yellow: { DEFAULT: "#fde047", fg: "#facc15", soft: "rgba(234, 179, 8, 0.14)",  border: "rgba(250, 204, 21, 0.45)" },
    },
  },
  shadow: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.4)",
    sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
    md: "0 4px 12px rgba(0, 0, 0, 0.4)",
    pop: "0 20px 45px rgba(0, 0, 0, 0.45)",
    dialog: "0 28px 80px rgba(0, 0, 0, 0.55)",
    fab: "0 18px 45px rgba(0, 0, 0, 0.55)",
  },
};

/* ── High Contrast (light base) ────────────────────────────── */
export const highContrastTokens: ThemeTokens = {
  ...lightTokens,
  mode: "light-hc",
  colors: {
    ...lightTokens.colors,
    background: "#ffffff",
    surface: "#ffffff",
    sidebar: "#ffffff",
    foreground: "#000000",
    foregroundMuted: "#1a1a1a",
    foregroundSubtle: "#333333",
    foregroundFaint: "#4d4d4d",
    border: "#000000",
    borderStrong: "#000000",
    ring: "#000000",
    hoverBg: "#f0f0f0",
    hoverBgStrong: "#e0e0e0",
    overlay: "rgba(0, 0, 0, 0.6)",
    accent: "#000000",
    accentHover: "#000000",
    accentFg: "#ffffff",
    semantic: {
      ...lightTokens.colors.semantic,
      blue:   { DEFAULT: "#0000ee", fg: "#0000ee", soft: "rgba(0, 0, 238, 0.12)", border: "#0000ee" },
      red:    { DEFAULT: "#cc0000", fg: "#cc0000", soft: "rgba(204, 0, 0, 0.12)", border: "#cc0000",
                solid: { DEFAULT: "#cc0000", hover: "#990000", fg: "#ffffff" } },
      green:  { DEFAULT: "#006400", fg: "#006400", soft: "rgba(0, 100, 0, 0.12)", border: "#006400" },
      orange: { DEFAULT: "#cc5500", fg: "#cc5500", soft: "rgba(204, 85, 0, 0.12)", border: "#cc5500" },
      yellow: { DEFAULT: "#ca8a04", fg: "#a16207", soft: "#fefce8", border: "#fde68a" },
    },
  },
  shadow: {
    ...lightTokens.shadow,
    sm: "0 0 0 1px #000000",
    pop: "0 0 0 2px #000000, 0 8px 24px rgba(0, 0, 0, 0.3)",
    dialog: "0 0 0 2px #000000, 0 16px 48px rgba(0, 0, 0, 0.4)",
  },
};

/* ── High Contrast (dark base) ─────────────────────────────── */
export const darkHighContrastTokens: ThemeTokens = {
  ...darkTokens,
  mode: "dark-hc",
  colors: {
    ...darkTokens.colors,
    background: "#000000",
    surface: "#000000",
    sidebar: "#000000",
    foreground: "#ffffff",
    foregroundMuted: "#f0f0f0",
    foregroundSubtle: "#cccccc",
    foregroundFaint: "#b3b3b3",
    border: "#ffffff",
    borderStrong: "#ffffff",
    ring: "#ffffff",
    hoverBg: "rgba(255, 255, 255, 0.15)",
    hoverBgStrong: "rgba(255, 255, 255, 0.25)",
    overlay: "rgba(0, 0, 0, 0.8)",
    accent: "#ffffff",
    accentHover: "#ffffff",
    accentFg: "#000000",
    semantic: {
      ...darkTokens.colors.semantic,
      blue:   { DEFAULT: "#6ba3ff", fg: "#6ba3ff", soft: "rgba(107, 163, 255, 0.12)", border: "#6ba3ff" },
      red:    { DEFAULT: "#ff6b6b", fg: "#ff6b6b", soft: "rgba(255, 107, 107, 0.12)", border: "#ff6b6b",
                solid: { DEFAULT: "#cc0000", hover: "#990000", fg: "#ffffff" } },
      green:  { DEFAULT: "#66d97a", fg: "#66d97a", soft: "rgba(102, 217, 122, 0.16)", border: "#66d97a" },
      orange: { DEFAULT: "#ff9b3d", fg: "#ff9b3d", soft: "rgba(255, 155, 61, 0.12)", border: "#ff9b3d" },
      yellow: { DEFAULT: "#fde047", fg: "#facc15", soft: "rgba(234, 179, 8, 0.14)", border: "rgba(250, 204, 21, 0.45)" },
    },
  },
  shadow: {
    ...darkTokens.shadow,
    sm: "0 0 0 1px #ffffff",
    pop: "0 0 0 2px #ffffff, 0 8px 24px rgba(0, 0, 0, 0.6)",
    dialog: "0 0 0 2px #ffffff, 0 16px 48px rgba(0, 0, 0, 0.7)",
  },
};

/* ── Theme registry ────────────────────────────────────────── */
export const themes: Record<ThemeMode, ThemeTokens> = {
  light: lightTokens,
  dark: darkTokens,
  "light-hc": highContrastTokens,
  "dark-hc": darkHighContrastTokens,
};

/**
 * Flattens a ThemeTokens object into a CSS variable map for runtime theme
 * injection (e.g. multi-tenant / multi-brand dynamic theme switching).
 */
export function tokensToCssVars(tokens: ThemeTokens): Record<string, string> {
  const s = tokens.colors.semantic;
  return {
    "--background": tokens.colors.background,
    "--surface": tokens.colors.surface,
    "--sidebar": tokens.colors.sidebar,
    "--muted": tokens.colors.muted,
    "--foreground": tokens.colors.foreground,
    "--foreground-muted": tokens.colors.foregroundMuted,
    "--foreground-subtle": tokens.colors.foregroundSubtle,
    "--foreground-faint": tokens.colors.foregroundFaint,
    "--foreground-on-accent": tokens.colors.foregroundOnAccent,
    "--border": tokens.colors.border,
    "--border-strong": tokens.colors.borderStrong,
    "--ring": tokens.colors.ring,
    "--hover-bg": tokens.colors.hoverBg,
    "--hover-bg-strong": tokens.colors.hoverBgStrong,
    "--overlay": tokens.colors.overlay,
    "--accent": tokens.colors.accent,
    "--accent-hover": tokens.colors.accentHover,
    "--accent-fg": tokens.colors.accentFg,
    "--accent-muted": tokens.colors.accentMuted,

    "--blue": s.blue.DEFAULT,
    "--blue-fg": s.blue.fg,
    "--blue-soft": s.blue.soft,
    "--blue-border": s.blue.border,

    "--orange": s.orange.DEFAULT,
    "--orange-fg": s.orange.fg,
    "--orange-soft": s.orange.soft,
    "--orange-border": s.orange.border,

    "--red": s.red.DEFAULT,
    "--red-fg": s.red.fg,
    "--red-soft": s.red.soft,
    "--red-border": s.red.border,
    "--red-solid": s.red.solid.DEFAULT,
    "--red-solid-hover": s.red.solid.hover,
    "--red-solid-fg": s.red.solid.fg,

    "--green": s.green.DEFAULT,
    "--green-fg": s.green.fg,
    "--green-soft": s.green.soft,
    "--green-border": s.green.border,

    "--yellow": s.yellow.DEFAULT,
    "--yellow-fg": s.yellow.fg,
    "--yellow-soft": s.yellow.soft,
    "--yellow-border": s.yellow.border,

    ...Object.fromEntries(
      Object.entries(tokens.colors.palette).map(([name, value]) => [
        `--color-${name}`,
        value,
      ])
    ),
  };
}
