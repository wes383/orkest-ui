"use client";

import * as React from "react";
import { Section, Panel, SubsectionLabel, Row, Stack } from "@/app/_components/demo-helpers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Steps,
  Step,
  StepIndicator,
  StepLabel,
  StepDescription,
  StepSeparator,
} from "@/components/ui/steps";
import { Button } from "@/components/ui/button";
import { Menu, MenuLabel, MenuItem, MenuDivider } from "@/components/ui/menu";
import { Edit, Copy, Archive, Trash } from "lucide-react";
import { useT } from "@/components/language-provider";

const STEP_TOTAL = 4;

export function NavigationSection() {
  const t = useT();
  const [current, setCurrent] = React.useState(1);

  return (
    <Section
      id="navigation"
      title={t("navigation.title")}
      description={t("navigation.description")}
    >
      <Stack className="gap-4">
        <Panel>
          <SubsectionLabel>{t("navigation.tabs")}</SubsectionLabel>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">{t("navigation.all")}</TabsTrigger>
              <TabsTrigger value="today">{t("navigation.today")}</TabsTrigger>
              <TabsTrigger value="week">{t("navigation.week")}</TabsTrigger>
              <TabsTrigger value="done">{t("navigation.done")}</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="py-4 text-foreground-muted">{t("navigation.allContent")}</div>
            </TabsContent>
            <TabsContent value="today">
              <div className="py-4 text-foreground-muted">{t("navigation.todayContent")}</div>
            </TabsContent>
            <TabsContent value="week">
              <div className="py-4 text-foreground-muted">{t("navigation.weekContent")}</div>
            </TabsContent>
            <TabsContent value="done">
              <div className="py-4 text-foreground-muted">{t("navigation.doneContent")}</div>
            </TabsContent>
          </Tabs>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("navigation.steps")}</SubsectionLabel>
          <div className="mb-6">
            <Steps current={current}>
              <Step>
                <StepIndicator />
                <div className="flex flex-col ml-3">
                  <StepLabel>{t("navigation.step1")}</StepLabel>
                  <StepDescription>{t("navigation.step1Desc")}</StepDescription>
                </div>
                <StepSeparator />
              </Step>
              <Step>
                <StepIndicator />
                <div className="flex flex-col ml-3">
                  <StepLabel>{t("navigation.step2")}</StepLabel>
                  <StepDescription>{t("navigation.step2Desc")}</StepDescription>
                </div>
                <StepSeparator />
              </Step>
              <Step>
                <StepIndicator />
                <div className="flex flex-col ml-3">
                  <StepLabel>{t("navigation.step3")}</StepLabel>
                  <StepDescription>{t("navigation.step3Desc")}</StepDescription>
                </div>
                <StepSeparator />
              </Step>
              <Step>
                <StepIndicator />
                <div className="flex flex-col ml-3">
                  <StepLabel>{t("navigation.step4")}</StepLabel>
                  <StepDescription>{t("navigation.step4Desc")}</StepDescription>
                </div>
              </Step>
            </Steps>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              {t("navigation.prev")}
            </Button>
            <Button
              onClick={() => setCurrent((c) => Math.min(STEP_TOTAL, c + 1))}
              disabled={current === STEP_TOTAL}
            >
              {current === STEP_TOTAL - 1 ? t("navigation.finish") : t("navigation.next")}
            </Button>
          </div>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("navigation.menu")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("navigation.menuHint")}
          </p>
          <Menu className="w-56">
            <MenuLabel>{t("navigation.menuGroup")}</MenuLabel>
            <MenuItem>
              <Edit className="h-4 w-4" />
              {t("navigation.menuEdit")}
            </MenuItem>
            <MenuItem>
              <Copy className="h-4 w-4" />
              {t("navigation.menuDuplicate")}
            </MenuItem>
            <MenuItem>
              <Archive className="h-4 w-4" />
              {t("navigation.menuArchive")}
            </MenuItem>
            <MenuDivider />
            <MenuItem variant="danger">
              <Trash className="h-4 w-4" />
              {t("navigation.menuDelete")}
            </MenuItem>
          </Menu>
        </Panel>
      </Stack>
    </Section>
  );
}
