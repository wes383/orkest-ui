"use client";

import * as React from "react";
import { ThemeToggle, LanguageToggle } from "@/app/_components/theme-toggle";
import { DensityToggle } from "@/app/_components/density-toggle";
import { useT } from "@/components/language-provider";
import { ColorsSection } from "@/app/_sections/colors-section";
import { TypographySection } from "@/app/_sections/typography-section";
import { ButtonsSection } from "@/app/_sections/buttons-section";
import { FormsSection } from "@/app/_sections/forms-section";
import { BadgesSection } from "@/app/_sections/badges-section";
import { ProgressSection } from "@/app/_sections/progress-section";
import { OverlaysSection } from "@/app/_sections/overlays-section";
import { DataDisplaySection } from "@/app/_sections/data-display-section";
import { LayoutSection } from "@/app/_sections/layout-section";
import { MediaSection } from "@/app/_sections/media-section";
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
    { href: "#layout", label: t("nav.layout") },
    { href: "#media", label: t("nav.media") },
    { href: "#navigation", label: t("nav.navigation") },
    { href: "#feedback", label: t("nav.feedback") },
    { href: "#misc", label: t("nav.misc") },
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
              {/* Thirteen anchors do not fit a phone: they wrap into three
                  rows inside a sticky header and eat the screen. Below `md`
                  the header keeps only the logo and the three switches. */}
              <nav
                className="hidden flex-wrap items-center gap-1 max-w-full md:flex"
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
              <LanguageToggle />
              <DensityToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-16 pb-12">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-3">
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
        <LayoutSection />
        <MediaSection />
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
