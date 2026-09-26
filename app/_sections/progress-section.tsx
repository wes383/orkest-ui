"use client";

import * as React from "react";
import { Section, Panel, SubsectionLabel, Stack, Row } from "@/app/_components/demo-helpers";
import { Progress, CircularProgress } from "@/components/ui/progress";
import { Skeleton, SkeletonText, SkeletonCircle } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useT } from "@/components/language-provider";

export function ProgressSection() {
  const t = useT();

  // Drives the container-scoped LoadingOverlay demo: auto-dismisses so the
  // loaded state is visible, and can be re-triggered from the button.
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), 1500);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <Section
      id="progress"
      title={t("progress.title")}
      description={t("progress.description")}
    >
      <Panel className="mb-4">
        <Stack className="gap-5">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-sm">{t("progress.reading")}</span>
              <span className="text-xs text-foreground-subtle">40%</span>
            </div>
            <Progress value={40} color="bg-palette-indigo" />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-sm">{t("progress.running")}</span>
              <span className="text-xs text-foreground-subtle">80%</span>
            </div>
            <Progress value={80} color="bg-green" />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-sm">{t("progress.projectCompletion")}</span>
              <span className="text-xs text-foreground-subtle">65%</span>
            </div>
            <Progress value={65} variant="thick" color="bg-orange" />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-sm">{t("progress.syncStatus")}</span>
              <span className="text-xs text-foreground-subtle">95%</span>
            </div>
            <Progress value={95} variant="thin" />
          </div>
        </Stack>
      </Panel>

      <Panel>
        <SubsectionLabel>{t("progress.circular")}</SubsectionLabel>
        <Row className="items-start gap-8">
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={72} size={64} label="72%" />
            <span className="text-xs text-foreground-muted">{t("progress.completion")}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={100} size={64} className="[&>circle:nth-child(2)]:stroke-green" />
            <span className="text-xs text-foreground-muted">{t("progress.done")}</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
            <span className="text-xs text-foreground-muted">{t("progress.indicator")}</span>
          </div>

          <div className="flex-1 max-w-xs space-y-3">
            <div className="flex items-center gap-3">
              <SkeletonCircle size="sm" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <SkeletonText lines={3} />
          </div>
        </Row>
      </Panel>

      <Panel className="mt-4">
        <SubsectionLabel>{t("progress.loadingOverlay")}</SubsectionLabel>
        <p className="text-xs text-foreground-subtle mb-3">
          {t("progress.loadingOverlayHint")}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mb-3"
          onClick={() => setLoading(true)}
        >
          {t("progress.refreshData")}
        </Button>
        <div className="relative h-40 overflow-hidden rounded-lg border border-border bg-surface">
          <div className="p-4 text-sm text-foreground-muted">
            {t("progress.overlayPanel")}
          </div>
          {loading && (
            <LoadingOverlay container message={t("progress.loadingMessage")} />
          )}
        </div>
      </Panel>
    </Section>
  );
}
