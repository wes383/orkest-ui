"use client";

import * as React from "react";
import { ThemeToggle, CommandPaletteButton, LanguageToggle } from "@/app/_components/theme-toggle";
import { useT } from "@/components/language-provider";
import { ColorsSection } from "@/app/_sections/colors-section";
import { TypographySection } from "@/app/_sections/typography-section";
import { ButtonsSection } from "@/app/_sections/buttons-section";
import { FormsSection } from "@/app/_sections/forms-section";
import { BadgesSection } from "@/app/_sections/badges-section";
import { ProgressSection } from "@/app/_sections/progress-section";
import { OverlaysSection } from "@/app/_sections/overlays-section";
import { DataDisplaySection } from "@/app/_sections/data-display-section";
import { NavigationSection } from "@/app/_sections/navigation-section";
import { FeedbackSection } from "@/app/_sections/feedback-section";
import { MiscSection } from "@/app/_sections/misc-section";

export default function HomePage() {
  const t = useT();

  const navLinks = [
    { href: "#colors", label: t("nav.colors") },
    { href: "#typography", label: t("nav.typography") },
    { href: "#buttons", label: t("nav.buttons") },
    { href: "#forms", label: t("nav.forms") },
    { href: "#badges", label: t("nav.badges") },
    { href: "#progress", label: t("nav.progress") },
    { href: "#overlays", label: t("nav.overlays") },
    { href: "#data-display", label: t("nav.dataDisplay") },
    { href: "#navigation", label: t("nav.navigation") },
    { href: "#feedback", label: t("nav.feedback") },
    { href: "#misc", label: t("nav.misc") },
  ];

  const stats = [
    { label: t("stats.components"), value: "63+" },
    { label: t("stats.hooks"), value: "12" },
    { label: t("stats.themes"), value: "3" },
    { label: t("stats.tokens"), value: "80+" },
  ];

  return (
    <div id="top" className="min-h-screen bg-background text-foreground scroll-mt-0">
      <header className="sticky top-0 z-sticky bg-background">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-6 min-w-0">
              <a
                href="#top"
                className="font-display text-base font-bold tracking-tight leading-none hover:text-accent transition-colors shrink-0"
              >
                Orkest UI
              </a>
              <nav
                className="flex flex-wrap items-center gap-1 max-w-full"
                aria-label="Section navigation"
              >
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-foreground-muted transition-colors hover:bg-hover-bg hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <CommandPaletteButton />
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-16 pb-12">
        <div className="max-w-3xl">
          <h2 className="font-display text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            {t("hero.title1")}
            <br />
            <span className="text-foreground-muted">{t("hero.title2")}</span>
          </h2>
          <p className="mt-6 text-lg text-foreground-muted leading-relaxed max-w-2xl">
            {t("hero.description")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#colors"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent text-accent-fg hover:bg-accent-hover transition-all duration-base ease-out h-10 px-5 text-sm font-medium active:scale-[0.97]"
            >
              {t("hero.browseCta")}
            </a>
            <a
              href="/docs/design-system.md"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-surface text-foreground border border-border hover:bg-hover-bg transition-all duration-base ease-out h-10 px-5 text-sm font-medium active:scale-[0.97]"
            >
              {t("hero.docsCta")}
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="font-display text-3xl font-bold tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs text-foreground-muted mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1200px] px-6 lg:px-8 pb-24">
        <ColorsSection />
        <TypographySection />
        <ButtonsSection />
        <FormsSection />
        <BadgesSection />
        <ProgressSection />
        <OverlaysSection />
        <DataDisplaySection />
        <NavigationSection />
        <FeedbackSection />
        <MiscSection />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-foreground-muted">
              Orkest UI
            </span>
            <div className="text-xs text-foreground-subtle">
              {t("footer.tagline")}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
