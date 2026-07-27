"use client";

import { Plus, Download, Info, Settings } from "lucide-react";
import { Section, Panel, SubsectionLabel, Row, Stack } from "@/app/_components/demo-helpers";
import { Button, ButtonGroup } from "@/components/ui/button";
import { useT } from "@/components/language-provider";

export function ButtonsSection() {
  const t = useT();

  return (
    <Section
      id="buttons"
      title={t("buttons.title")}
      description={t("buttons.description")}
    >
      <Panel>
        <Stack className="gap-8">
          <div>
            <SubsectionLabel>{t("buttons.variants")}</SubsectionLabel>
            <Row>
              <Button>{t("buttons.default")}</Button>
              <Button variant="outline">{t("buttons.outline")}</Button>
              <Button variant="ghost">{t("buttons.ghost")}</Button>
              <Button variant="danger">{t("buttons.danger")}</Button>
              <Button variant="subtle">{t("buttons.subtle")}</Button>
              <Button variant="link">{t("buttons.link")}</Button>
              <Button disabled>{t("buttons.disabled")}</Button>
            </Row>
          </div>

          <div>
            <SubsectionLabel>{t("buttons.withIcon")}</SubsectionLabel>
            <Row>
              <Button>
                <Plus className="h-4 w-4" />
                {t("buttons.newTask")}
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4" />
                {t("buttons.export")}
              </Button>
              <Button variant="ghost">
                <Info className="h-4 w-4" />
                {t("buttons.details")}
              </Button>
              <Button variant="danger">
                <Download className="h-4 w-4" />
                {t("buttons.delete")}
              </Button>
            </Row>
          </div>

          <div>
            <SubsectionLabel>{t("buttons.loading")}</SubsectionLabel>
            <Row>
              <Button loading>{t("buttons.submitting")}</Button>
              <Button variant="outline" loading>
                {t("buttons.loading")}
              </Button>
              <Button variant="ghost" loading>
                {t("buttons.syncing")}
              </Button>
            </Row>
          </div>

          <div>
            <SubsectionLabel>{t("buttons.sizes")}</SubsectionLabel>
            <Row>
              <Button size="lg">{t("buttons.large")}</Button>
              <Button size="md">{t("buttons.medium")}</Button>
              <Button size="sm">{t("buttons.small")}</Button>
              <Button size="icon" aria-label="settings">
                <Settings className="h-4 w-4" />
              </Button>
              <Button size="icon-sm" aria-label="info">
                <Info className="h-4 w-4" />
              </Button>
              <Button size="fab" aria-label="add">
                <Plus className="h-5 w-5" />
              </Button>
            </Row>
          </div>

          <div>
            <SubsectionLabel>{t("buttons.buttonGroup")}</SubsectionLabel>
            <Row>
              <ButtonGroup>
                <Button variant="outline" size="sm">
                  {t("buttons.day")}
                </Button>
                <Button variant="outline" size="sm">
                  {t("buttons.week")}
                </Button>
                <Button variant="outline" size="sm">
                  {t("buttons.month")}
                </Button>
                <Button variant="outline" size="sm">
                  {t("buttons.year")}
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button size="sm">{t("buttons.primary")}</Button>
                <Button variant="outline" size="sm" aria-label="more options">
                  <Settings className="h-4 w-4" />
                </Button>
              </ButtonGroup>
            </Row>
          </div>

          <div>
            <SubsectionLabel>{t("buttons.asChild")}</SubsectionLabel>
            <Row>
              <Button asChild>
                <a href="#typography">{t("buttons.jumpToTypography")}</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://nextjs.org" target="_blank" rel="noreferrer">
                  {t("buttons.nextjsDocs")}
                </a>
              </Button>
            </Row>
          </div>
        </Stack>
      </Panel>
    </Section>
  );
}
