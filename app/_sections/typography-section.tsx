"use client";

import { Section, Panel, SubsectionLabel, Stack } from "@/app/_components/demo-helpers";
import { Divider } from "@/components/ui/divider";
import { Code } from "@/components/ui/typography";
import { useT } from "@/components/language-provider";

export function TypographySection() {
  const t = useT();

  return (
    <Section
      id="typography"
      title={t("typography.title")}
      description={t("typography.description")}
    >
      <Panel>
        <Stack className="gap-6">
          <div>
            <SubsectionLabel>{t("typography.display")}</SubsectionLabel>
            <div className="font-display text-[40px] font-bold leading-[1.1] tracking-tight">
              {t("typography.displayHeading")}
            </div>
            <div className="text-xs text-foreground-subtle mt-2 font-mono">
              {t("typography.displayFontNote")}
            </div>
          </div>

          <Divider />

          <div>
            <SubsectionLabel>{t("typography.bodyTitle")}</SubsectionLabel>
            <div className="text-2xl font-semibold">{t("typography.bodyTagline")}</div>
            <div className="text-base text-foreground-muted mt-2 leading-relaxed max-w-xl">
              {t("typography.bodyText")}
            </div>
            <div className="text-xs text-foreground-subtle mt-2 font-mono">
              {t("typography.bodyFontNote")}
            </div>
          </div>

          <Divider />

          <div>
            <SubsectionLabel>{t("typography.mono")}</SubsectionLabel>
            <div className="font-mono text-sm">
              25:00 · pomodoro · #2563EB · 0.85em
            </div>
            <div className="text-xs text-foreground-subtle mt-2 font-mono">
              {t("typography.monoFontNote")}
            </div>
          </div>

          <Divider />

          <div>
            <SubsectionLabel>{t("typography.label")}</SubsectionLabel>
            <label className="block text-[13px] font-medium tracking-wide text-foreground-muted mb-2">
              Priority
            </label>
          </div>

          <Divider />

          <div>
            <SubsectionLabel>{t("typography.inlineCode")}</SubsectionLabel>
            <p className="text-base">
              {t("typography.installDepsPrefix")}
              <Code>npm install</Code>
              {t("typography.installDepsSuffix")}
            </p>
          </div>

          <Divider />

          <div>
            <SubsectionLabel>{t("typography.scale")}</SubsectionLabel>
            <div className="space-y-1">
              <div className="text-5xl font-display font-bold tracking-tight">Aa 40</div>
              <div className="text-4xl font-display font-semibold tracking-tight">Aa 32</div>
              <div className="text-3xl font-display font-semibold tracking-tight">Aa 28</div>
              <div className="text-2xl font-display font-semibold tracking-tight">Aa 24</div>
              <div className="text-xl font-display font-semibold">Aa 20</div>
              <div className="text-lg">Aa 18</div>
              <div className="text-base">{t("typography.bodySample")}</div>
              <div className="text-sm text-foreground-muted">{t("typography.mutedSample")}</div>
              <div className="text-xs text-foreground-subtle">{t("typography.subtleSample")}</div>
            </div>
          </div>

          <Divider />

          <div className="rounded-md bg-hover-bg p-3">
            <p className="text-xs text-foreground-muted leading-relaxed">
              {t("typography.cjkFontNote")}
            </p>
          </div>
        </Stack>
      </Panel>
    </Section>
  );
}
