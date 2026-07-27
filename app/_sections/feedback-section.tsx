"use client";

import * as React from "react";
import { Section, Panel, SubsectionLabel, Stack, Grid, Row } from "@/app/_components/demo-helpers";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { Spinner } from "@/components/ui/spinner";
import { useT } from "@/components/language-provider";

export function FeedbackSection() {
  const t = useT();

  return (
    <Section
      id="feedback"
      title={t("feedback.title")}
      description={t("feedback.description")}
    >
      <Grid cols={2} className="mb-4">
        <Panel>
          <SubsectionLabel>{t("feedback.inlineAlert")}</SubsectionLabel>
          <Stack>
            <Alert variant="info">
              <AlertTitle>{t("feedback.syncDone")}</AlertTitle>
              <AlertDescription>
                {t("feedback.syncDoneDesc")}
              </AlertDescription>
            </Alert>
            <Alert variant="success">
              <AlertTitle>{t("feedback.focusComplete")}</AlertTitle>
              <AlertDescription>{t("feedback.focusCompleteDesc")}</AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTitle>{t("feedback.offlineMode")}</AlertTitle>
              <AlertDescription>{t("feedback.offlineModeDesc")}</AlertDescription>
            </Alert>
            <Alert variant="error">
              <AlertTitle>{t("feedback.syncFailed")}</AlertTitle>
              <AlertDescription>{t("feedback.syncFailedDesc")}</AlertDescription>
            </Alert>
          </Stack>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("feedback.toastTriggers")}</SubsectionLabel>
          <Stack>
            <Row>
              <Button
                variant="outline"
                onClick={() => toast.success(t("feedback.toastSuccessTitle"), { description: t("feedback.toastSuccessDesc") })}
              >
                {t("feedback.triggerSuccess")}
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.error(t("feedback.toastErrorTitle"), { description: t("feedback.toastErrorDesc") })}
              >
                {t("feedback.triggerError")}
              </Button>
            </Row>
            <Row>
              <Button
                variant="outline"
                onClick={() => toast.warning(t("feedback.toastWarningTitle"), { description: t("feedback.toastWarningDesc") })}
              >
                {t("feedback.triggerWarning")}
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info(t("feedback.toastInfoTitle"), { description: t("feedback.toastInfoDesc") })}
              >
                {t("feedback.triggerInfo")}
              </Button>
            </Row>
            <Row>
              <Button
                onClick={() =>
                  toast(t("feedback.toastActionTitle"), {
                    description: t("feedback.toastActionDesc"),
                    action: {
                      label: t("feedback.view"),
                      onClick: () => {},
                    },
                  })
                }
              >
                {t("feedback.actionToast")}
              </Button>
            </Row>

            <div className="mt-4 p-4 rounded-lg border border-border bg-surface">
              <SubsectionLabel>{t("feedback.toastPreview")}</SubsectionLabel>
              <div className="flex items-start gap-3 p-3.5 bg-surface border border-border rounded-lg shadow-pop">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{t("feedback.saveSuccess")}</p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    {t("feedback.saveSuccessDesc")}
                  </p>
                </div>
                <Button size="sm" className="h-8 px-3 text-xs">
                  {t("feedback.view")}
                </Button>
              </div>
              <div className="flex items-start gap-3 p-3.5 bg-surface border border-border rounded-lg shadow-pop mt-2">
                <Spinner size="sm" className="mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{t("feedback.syncing")}</p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    {t("feedback.syncingDesc")}
                  </p>
                </div>
              </div>
            </div>
          </Stack>
        </Panel>
      </Grid>
    </Section>
  );
}
