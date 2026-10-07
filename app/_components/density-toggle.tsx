"use client";

import * as React from "react";
import { Check, Rows3, Rows4 } from "lucide-react";
import { useDensityMode, type Density } from "@/components/density-provider";
import { useT } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Header control for switching the whole showcase between the default and the
 * compact density tier.
 *
 * Same shape as LanguageToggle: an outline button that opens a menu listing the
 * tiers. The trigger pins `size="sm"` so the control itself keeps a stable size
 * while it changes every other control on the page.
 */
const OPTIONS: { value: Density; labelKey: string; Icon: React.ElementType }[] = [
  { value: "default", labelKey: "densityToggle.default", Icon: Rows3 },
  { value: "compact", labelKey: "densityToggle.compact", Icon: Rows4 },
];

export function DensityToggle() {
  const { density, setDensity } = useDensityMode();
  const t = useT();

  const current = OPTIONS.find((o) => o.value === density) ?? OPTIONS[0];
  const CurrentIcon = current.Icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={t("densityToggle.label")}
          className="gap-1.5"
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="text-xs">{t(current.labelKey)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-[160px]">
        <DropdownMenuLabel>{t("densityToggle.label")}</DropdownMenuLabel>
        {OPTIONS.map(({ value, labelKey, Icon }) => (
          <DropdownMenuItem key={value} onClick={() => setDensity(value)}>
            <Icon className="h-4 w-4" />
            <span>{t(labelKey)}</span>
            {density === value && (
              <Check className="ml-auto h-3.5 w-3.5 text-foreground-muted" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
