"use client";

import * as React from "react";
import { Moon, Sun, Contrast, Check, Languages } from "lucide-react";
import { useAppTheme } from "@/components/theme-provider";
import { useLanguage, useT } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { languages, type Lang } from "@/lib/i18n";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, highContrast, toggleHighContrast } =
    useAppTheme();
  const t = useT();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch — render a placeholder until mounted.
  if (!mounted) {
    return (
      <Button variant="outline" size="sm" aria-label={t("themeToggle.label")}>
        <Sun className="h-4 w-4" />
        <span>{t("themeToggle.label")}</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label={t("themeToggle.label")}>
          {isDark ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span>{isDark ? t("themeToggle.dark") : t("themeToggle.light")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-[180px]">
        <DropdownMenuLabel>{t("themeToggle.appearance")}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4" />
          <span>{t("themeToggle.light")}</span>
          {!isDark && !highContrast && (
            <Check className="ml-auto h-3.5 w-3.5 text-foreground-muted" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4" />
          <span>{t("themeToggle.dark")}</span>
          {isDark && !highContrast && (
            <Check className="ml-auto h-3.5 w-3.5 text-foreground-muted" />
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleHighContrast}>
          <Contrast className="h-4 w-4" />
          <span>{t("themeToggle.highContrast")}</span>
          {highContrast && (
            <Check className="ml-auto h-3.5 w-3.5 text-foreground-muted" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // Stable label on first paint to avoid hydration mismatch.
  const label = mounted
    ? languages.find((l) => l.code === lang)?.label ?? "中文"
    : "中文";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={label}
          className="gap-1.5"
        >
          <Languages className="h-4 w-4" />
          <span className="text-xs">{lang === "zh" ? "中" : "EN"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-[140px]">
        <DropdownMenuLabel>
          {lang === "zh" ? "语言" : "Language"}
        </DropdownMenuLabel>
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
          >
            <span>{l.label}</span>
            {lang === l.code && (
              <Check className="ml-auto h-3.5 w-3.5 text-foreground-muted" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CommandPaletteButton() {
  const t = useT();
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("gap-2")}
      aria-label={t("commandPalette.ariaLabel")}
      onClick={() =>
        toast.info(t("commandPalette.title"), {
          description: t("commandPalette.description"),
        })
      }
    >
      <span className="text-foreground-muted">
        {t("commandPalette.searchPlaceholder")}
      </span>
      <kbd
        className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 bg-hover-bg-strong border border-border rounded-sm font-mono text-xs text-foreground-muted"
        aria-hidden="true"
      >
        ⌘K
      </kbd>
    </Button>
  );
}
