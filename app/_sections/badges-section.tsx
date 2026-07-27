"use client";

import * as React from "react";
import { Section, Panel, SubsectionLabel, Row, Stack } from "@/app/_components/demo-helpers";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/tag";
import { Chip } from "@/components/ui/chip";
import { useT } from "@/components/language-provider";

export function BadgesSection() {
  const t = useT();

  return (
    <Section
      id="badges"
      title={t("badges.title")}
      description={t("badges.description")}
    >
      <Panel>
        <Stack className="gap-8">
          <div>
            <SubsectionLabel>{t("badges.priorityBadge")}</SubsectionLabel>
            <Row>
              <Badge variant="secondary">{t("forms.low")}</Badge>
              <Badge variant="info">{t("forms.medium")}</Badge>
              <Badge variant="warning">{t("forms.high")}</Badge>
              <Badge variant="danger">{t("forms.urgent")}</Badge>
              <Badge variant="success">{t("badges.completed")}</Badge>
              <Badge variant="outline">{t("badges.draft")}</Badge>
            </Row>
          </div>

          <div>
            <SubsectionLabel>{t("badges.dotBadge")}</SubsectionLabel>
            <Row>
              <Badge variant="success" dot>
                {t("badges.syncDone")}
              </Badge>
              <Badge variant="warning" dot>
                {t("badges.syncing")}
              </Badge>
              <Badge variant="secondary" dot>
                {t("badges.offline")}
              </Badge>
            </Row>
          </div>

          <div>
            <SubsectionLabel>{t("badges.tag")}</SubsectionLabel>
            <Row>
              <Tag>{t("badges.work")}</Tag>
              <Tag>{t("badges.deepLearning")}</Tag>
              <Tag>{t("badges.daily")}</Tag>
              <Tag>25min</Tag>
              <Tag>Pomodoro</Tag>
              <Tag variant="solid">v1.0</Tag>
            </Row>
          </div>

          <div>
            <SubsectionLabel>{t("badges.chip")}</SubsectionLabel>
            <Row>
              <Chip onRemove={() => {}}>{t("badges.frontend")}</Chip>
              <Chip onRemove={() => {}}>{t("badges.react19")}</Chip>
              <Chip onRemove={() => {}}>{t("badges.typescript")}</Chip>
              <Chip>{t("badges.notRemovable")}</Chip>
            </Row>
          </div>
        </Stack>
      </Panel>
    </Section>
  );
}
