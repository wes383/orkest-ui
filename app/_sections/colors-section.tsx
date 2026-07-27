"use client";

import { Section, SubsectionLabel, Grid, Swatch } from "@/app/_components/demo-helpers";
import { useT } from "@/components/language-provider";

export function ColorsSection() {
  const t = useT();

  const baseColors = [
    { name: "Background", hex: "#fcfbfa", description: t("colors.background") },
    { name: "Sidebar", hex: "#fafaf9", description: t("colors.sidebar") },
    { name: "Surface", hex: "#ffffff", description: t("colors.surface") },
    { name: "Foreground", hex: "#25242a", description: t("colors.foreground") },
  ];

  const semanticColors = [
    { name: "Blue · Medium", hex: "#2563eb", description: t("colors.blue") },
    { name: "Orange · High", hex: "#ea580c", description: t("colors.orange") },
    { name: "Red · Urgent", hex: "#dc2626", description: t("colors.red") },
    { name: "Green · Success", hex: "#16a34a", description: t("colors.green") },
  ];

  // 19-color project palette — warm-shifted & desaturated (see app/globals.css)
  const paletteColors = [
    { name: "red", hex: "#c8585a" },
    { name: "orange", hex: "#cc7344" },
    { name: "amber", hex: "#c89248" },
    { name: "yellow", hex: "#bba348" },
    { name: "lime", hex: "#7d9a48" },
    { name: "green", hex: "#5d9a5d" },
    { name: "emerald", hex: "#549770" },
    { name: "teal", hex: "#4d9088" },
    { name: "cyan", hex: "#4d8fa8" },
    { name: "sky", hex: "#5e93b8" },
    { name: "blue", hex: "#5d83bb" },
    { name: "indigo", hex: "#7373b3" },
    { name: "violet", hex: "#8974b3" },
    { name: "purple", hex: "#9c77ab" },
    { name: "fuchsia", hex: "#a96fa0" },
    { name: "pink", hex: "#b8758a" },
    { name: "rose", hex: "#b56874" },
    { name: "gray", hex: "#847a7e" },
    { name: "slate", hex: "#787e85" },
  ];

  return (
    <Section
      id="colors"
      title={t("colors.title")}
      description={t("colors.description")}
    >
      <div className="space-y-8">
        <div>
          <SubsectionLabel>{t("colors.base")}</SubsectionLabel>
          <Grid cols={4}>
            {baseColors.map((c) => (
              <Swatch key={c.name} name={c.name} hex={c.hex} description={c.description} />
            ))}
          </Grid>
        </div>

        <div>
          <SubsectionLabel>{t("colors.semantic")}</SubsectionLabel>
          <Grid cols={4}>
            {semanticColors.map((c) => (
              <Swatch key={c.name} name={c.name} hex={c.hex} description={c.description} />
            ))}
          </Grid>
        </div>

        <div>
          <SubsectionLabel>{t("colors.palette")}</SubsectionLabel>
          <p className="text-xs text-foreground-muted mb-4 max-w-2xl leading-relaxed">
            {t("colors.paletteDescription")}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {paletteColors.map((c) => (
              <div
                key={c.name}
                className="overflow-hidden rounded-md border border-border"
              >
                <div
                  className="h-14"
                  style={{ backgroundColor: c.hex }}
                  aria-hidden="true"
                />
                <div className="bg-surface px-2.5 py-2">
                  <div className="font-mono text-[11px] text-foreground">
                    {c.name}
                  </div>
                  <div className="font-mono text-[10px] text-foreground-subtle uppercase mt-0.5">
                    {c.hex}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
