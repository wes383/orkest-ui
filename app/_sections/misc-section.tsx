"use client";

import * as React from "react";
import { Section, Panel, SubsectionLabel, Row, Stack } from "@/app/_components/demo-helpers";
import { Divider } from "@/components/ui/divider";
import { Kbd } from "@/components/ui/kbd";
import { Code } from "@/components/ui/typography";
import { Spinner } from "@/components/ui/spinner";
import { useT } from "@/components/language-provider";

export function MiscSection() {
  const t = useT();

  return (
    <Section
      id="misc"
      title={t("misc.title")}
      description={t("misc.description")}
    >
      <Panel>
        <Stack className="gap-8">
          <Row className="items-start gap-12">
            <div>
              <SubsectionLabel>{t("misc.loading")}</SubsectionLabel>
              <Row>
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <span className="text-sm text-foreground-muted">{t("misc.loadingEllipsis")}</span>
              </Row>
            </div>

            <div>
              <SubsectionLabel>{t("misc.kbd")}</SubsectionLabel>
              <Row>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
                <span className="text-sm text-foreground-muted">{t("misc.openCommand")}</span>
              </Row>
            </div>

            <div>
              <SubsectionLabel>{t("misc.code")}</SubsectionLabel>
              <Code>var(--blue: #2563eb)</Code>
            </div>
          </Row>

          <Divider label={t("misc.dividerWithLabel")} />

          <div>
            <SubsectionLabel>{t("misc.divider")}</SubsectionLabel>
            <div className="text-sm">{t("misc.above")}</div>
            <Divider className="my-6" />
            <div className="text-sm">{t("misc.below")}</div>
          </div>
        </Stack>
      </Panel>
    </Section>
  );
}
