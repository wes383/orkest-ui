"use client";

import * as React from "react";
import {
  Section,
  Panel,
  SubsectionLabel,
  Row,
  Stack,
  Grid,
} from "@/app/_components/demo-helpers";
import { Container } from "@/components/ui/container";
import { Flex } from "@/components/ui/flex";
import { Grid as LayoutGrid, Col } from "@/components/ui/grid";
import { Stack as LayoutStack } from "@/components/ui/stack";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useT } from "@/components/language-provider";

/** Cell helper shared by the Flex / Grid / Stack demos. */
function Cell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={[
        "rounded-md border border-border bg-hover-bg px-3 py-1.5 text-xs text-foreground-muted",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

/** Two-pane resizable demo; `withHandle` toggles the grip button on the divider. */
function ResizableDemo({ withHandle }: { withHandle: boolean }) {
  const t = useT();
  return (
    // react-resizable-panels writes an inline `height: 100%` onto the group, which
    // outranks any h-* utility on the group itself. The height must therefore be
    // set on a wrapper element.
    <div className="h-40">
      <ResizablePanelGroup
        direction="horizontal"
        className="overflow-hidden rounded-lg border border-border"
      >
        {/* minSize keeps either panel from being dragged down to nothing. */}
        <ResizablePanel defaultSize={50} minSize={25}>
          <div className="flex h-full items-center justify-center text-xs text-foreground-muted">
            {t("layout.leftPanel")}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle={withHandle} />
        <ResizablePanel defaultSize={50} minSize={25}>
          <div className="flex h-full items-center justify-center text-xs text-foreground-muted">
            {t("layout.rightPanel")}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export function LayoutSection() {
  const t = useT();

  const containerSizes = ["sm", "md", "lg"] as const;
  const stackItems = [1, 2, 3] as const;

  return (
    <Section
      id="layout"
      title={t("layout.title")}
      description={t("layout.description")}
    >
      <Stack className="gap-4">
        <Panel>
          <SubsectionLabel>{t("layout.container")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("layout.containerHint")}
          </p>
          <div className="space-y-2">
            {containerSizes.map((size) => (
              <Container
                key={size}
                size={size}
                className="rounded-md border border-dashed border-border-strong py-2 text-center text-xs text-foreground-muted"
              >
                {size}
              </Container>
            ))}
          </div>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("layout.flex")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("layout.flexHint")}
          </p>
          <Stack className="gap-3">
            <Flex gap="sm" className="rounded-md border border-border p-3">
              <Cell>{t("layout.flexItem")} 1</Cell>
              <Cell>{t("layout.flexItem")} 2</Cell>
              <Cell>{t("layout.flexItem")} 3</Cell>
            </Flex>
            <Flex justify="between" className="rounded-md border border-border p-3">
              <Cell>{t("layout.flexItem")} 1</Cell>
              <Cell>{t("layout.flexItem")} 2</Cell>
            </Flex>
            <Flex
              direction="column"
              align="start"
              gap="sm"
              className="rounded-md border border-border p-3"
            >
              <Cell>{t("layout.flexItem")} 1</Cell>
              <Cell>{t("layout.flexItem")} 2</Cell>
            </Flex>
          </Stack>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("layout.grid")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("layout.gridHint")}
          </p>
          <Stack className="gap-3">
            <LayoutGrid columns={2} responsive gap="md">
              {[1, 2].map((i) => (
                <Col key={i}>
                  <Cell className="block text-center">
                    {t("layout.gridCell")} {i}
                  </Cell>
                </Col>
              ))}
            </LayoutGrid>
            <LayoutGrid columns={3} responsive gap="md">
              <Col span={2}>
                <Cell className="block text-center">
                  {t("layout.gridCell")} 1 · span 2
                </Cell>
              </Col>
              <Col span={1}>
                <Cell className="block text-center">
                  {t("layout.gridCell")} 2 · span 1
                </Cell>
              </Col>
            </LayoutGrid>
          </Stack>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("layout.stack")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("layout.stackHint")}
          </p>
          <LayoutStack gap="md" divider={<Separator />}>
            {stackItems.map((i) => (
              <div key={i} className="text-sm text-foreground-muted">
                {t("layout.stackItem")} {i}
              </div>
            ))}
          </LayoutStack>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("layout.aspectRatio")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("layout.aspectRatioHint")}
          </p>
          {/* Width must be constrained on a wrapper: Radix applies className to
              its inner absolutely-positioned box, while the outer box derives
              its height from a padding-bottom percentage of the containing
              block's width. Sizing the wrapper keeps both in agreement.
              All three share one width so the ratios can be compared directly. */}
          <Row className="items-start gap-6">
            <div className="w-40 shrink-0">
              <AspectRatio
                ratio={16 / 9}
                className="flex items-center justify-center rounded-lg border border-border bg-hover-bg text-xs text-foreground-muted"
              >
                16 : 9
              </AspectRatio>
            </div>
            <div className="w-40 shrink-0">
              <AspectRatio
                ratio={1}
                className="flex items-center justify-center rounded-lg border border-border bg-hover-bg text-xs text-foreground-muted"
              >
                1 : 1
              </AspectRatio>
            </div>
            <div className="w-40 shrink-0">
              <AspectRatio
                ratio={4 / 3}
                className="flex items-center justify-center rounded-lg border border-border bg-hover-bg text-xs text-foreground-muted"
              >
                4 : 3
              </AspectRatio>
            </div>
          </Row>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("layout.resizable")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("layout.resizableHint")}
          </p>
          {/* Both variants share one layout so the only difference is the divider. */}
          <Grid cols={2}>
            <div>
              <p className="mb-2 text-xs text-foreground-subtle">
                {t("layout.resizableWithHandle")}
              </p>
              <ResizableDemo withHandle />
            </div>
            <div>
              <p className="mb-2 text-xs text-foreground-subtle">
                {t("layout.resizablePlain")}
              </p>
              <ResizableDemo withHandle={false} />
            </div>
          </Grid>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("layout.scrollArea")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("layout.scrollAreaHint")}
          </p>
          <ScrollArea className="h-40 rounded-lg border border-border">
            <div className="space-y-2 p-3">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="rounded-md bg-hover-bg px-3 py-2 text-xs text-foreground-muted"
                >
                  {t("layout.scrollItem")} {i + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Panel>
      </Stack>
    </Section>
  );
}
