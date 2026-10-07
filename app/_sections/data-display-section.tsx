"use client";

import * as React from "react";
import { Section, Panel, SubsectionLabel, Row, Stack, Grid } from "@/app/_components/demo-helpers";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Descriptions,
  DescriptionsItem,
} from "@/components/ui/descriptions";
import {
  List,
  ListItem,
  ListSeparator,
} from "@/components/ui/list";
import {
  Statistic,
  StatisticLabel,
  StatisticValue,
  StatisticPrefix,
  StatisticSuffix,
  StatisticTrend,
  StatisticCard,
} from "@/components/ui/statistic";
import {
  Empty,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyActions,
} from "@/components/ui/empty";
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
} from "@/components/ui/timeline";
import {
  Result,
  ResultTitle,
  ResultSubtitle,
  ResultActions,
} from "@/components/ui/result";
import { Inbox, Plus, Download, Check, Zap, GitPullRequest } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbList,
 BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useT } from "@/components/language-provider";

export function DataDisplaySection() {
  const t = useT();

  const tasks = [
    { id: 1, title: t("dataDisplay.task1Title"), priority: "medium" as const, status: t("badges.syncing") },
    { id: 2, title: t("dataDisplay.task2Title"), priority: "high" as const, status: t("forms.disabled") },
    { id: 3, title: t("dataDisplay.task3Title"), priority: "low" as const, status: t("badges.completed") },
  ];

  const listItems = [
    t("dataDisplay.task1Title"),
    t("dataDisplay.task2Title"),
    t("dataDisplay.task3Title"),
  ];

  const timelineItems = [
    { title: t("dataDisplay.tlCreate"), desc: t("dataDisplay.tlCreateDesc"), time: "09:12", color: "blue" as const, icon: <Plus className="h-3.5 w-3.5" /> },
    { title: t("dataDisplay.tlFocus"), desc: t("dataDisplay.tlFocusDesc"), time: "10:30", color: "orange" as const, icon: <Zap className="h-3.5 w-3.5" /> },
    { title: t("dataDisplay.tlReview"), desc: t("dataDisplay.tlReviewDesc"), time: "14:05", color: "yellow" as const, icon: <GitPullRequest className="h-3.5 w-3.5" /> },
    { title: t("dataDisplay.tlDone"), desc: t("dataDisplay.tlDoneDesc"), time: "18:00", color: "green" as const, icon: <Check className="h-3.5 w-3.5" /> },
  ];

  return (
    <Section
      id="data-display"
      title={t("dataDisplay.title")}
      description={t("dataDisplay.description")}
    >
      <div className="space-y-4">
        <Panel>
          <SubsectionLabel>{t("dataDisplay.card")}</SubsectionLabel>
          <Grid cols={3}>
            {/* Empty card shells — inner content intentionally removed. */}
            <Card hoverable className="min-h-[140px]" />
            <Card hoverable className="min-h-[140px]" />
            <Card hoverable className="min-h-[140px]" />
          </Grid>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("dataDisplay.table")}</SubsectionLabel>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("dataDisplay.colTask")}</TableHead>
                <TableHead>{t("dataDisplay.colPriority")}</TableHead>
                <TableHead>{t("dataDisplay.colStatus")}</TableHead>
                <TableHead className="text-right">{t("dataDisplay.colAction")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    {task.priority === "high" && <Badge variant="warning">{t("forms.high")}</Badge>}
                    {task.priority === "medium" && <Badge variant="info">{t("forms.medium")}</Badge>}
                    {task.priority === "low" && <Badge variant="secondary">{t("forms.low")}</Badge>}
                  </TableCell>
                  <TableCell className="text-foreground-muted">{task.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      {t("dataDisplay.edit")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("dataDisplay.descriptions")}</SubsectionLabel>
          <Descriptions>
            <DescriptionsItem label={t("dataDisplay.descStatus")}>
              <Badge variant="info">{t("dataDisplay.descStatusValue")}</Badge>
            </DescriptionsItem>
            <DescriptionsItem label={t("dataDisplay.descOwner")}>
              {t("dataDisplay.descOwnerValue")}
            </DescriptionsItem>
            <DescriptionsItem label={t("dataDisplay.descDue")}>
              {t("dataDisplay.descDueValue")}
            </DescriptionsItem>
            <DescriptionsItem label={t("dataDisplay.descProgress")}>
              {t("dataDisplay.descProgressValue")}
            </DescriptionsItem>
          </Descriptions>
        </Panel>

        <Grid cols={2}>
          <Panel>
            <SubsectionLabel>{t("dataDisplay.list")}</SubsectionLabel>
            <p className="text-xs text-foreground-subtle mb-3">
              {t("dataDisplay.listHint")}
            </p>
            <List>
              {listItems.map((item, i) => (
                <React.Fragment key={item}>
                  {i > 0 && <ListSeparator />}
                  <ListItem>
                    <Check className="h-4 w-4 text-foreground-subtle" />
                    <span className="text-sm">{item}</span>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Panel>

          <Panel>
            <SubsectionLabel>{t("dataDisplay.timeline")}</SubsectionLabel>
            <p className="text-xs text-foreground-subtle mb-3">
              {t("dataDisplay.timelineHint")}
            </p>
            <Timeline>
              {timelineItems.map((item, i) => (
                <TimelineItem
                  key={item.title}
                  isLast={i === timelineItems.length - 1}
                >
                  <TimelineDot color={item.color}>{item.icon}</TimelineDot>
                  <TimelineContent>
                    <div className="flex items-baseline justify-between gap-3">
                      <TimelineTitle>{item.title}</TimelineTitle>
                      <TimelineTime>{item.time}</TimelineTime>
                    </div>
                    <TimelineDescription>{item.desc}</TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Panel>
        </Grid>

        <Panel>
          <SubsectionLabel>{t("dataDisplay.statistic")}</SubsectionLabel>
          <Grid cols={4}>
            <StatisticCard>
              <Statistic>
                <StatisticLabel>{t("dataDisplay.weeklyTasks")}</StatisticLabel>
                <StatisticValue>28</StatisticValue>
                <StatisticTrend direction="up" value="+12%" />
              </Statistic>
            </StatisticCard>
            <StatisticCard>
              <Statistic>
                <StatisticLabel>{t("dataDisplay.focusHours")}</StatisticLabel>
                <StatisticValue>
                  <StatisticPrefix>~</StatisticPrefix>
                  14.5
                  <StatisticSuffix>h</StatisticSuffix>
                </StatisticValue>
                <StatisticTrend direction="up" value="+3.2h" />
              </Statistic>
            </StatisticCard>
            <StatisticCard>
              <Statistic>
                <StatisticLabel>{t("dataDisplay.completionRate")}</StatisticLabel>
                <StatisticValue>86%</StatisticValue>
                <StatisticTrend direction="down" value="-4%" />
              </Statistic>
            </StatisticCard>
            <StatisticCard>
              <Statistic>
                <StatisticLabel>{t("dataDisplay.streak")}</StatisticLabel>
                <StatisticValue>
                  23
                  <StatisticSuffix className="ml-1 text-base">
                    {t("dataDisplay.days")}
                  </StatisticSuffix>
                </StatisticValue>
                <StatisticTrend direction="up" value="+1" />
              </Statistic>
            </StatisticCard>
          </Grid>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("dataDisplay.avatar")}</SubsectionLabel>
          <Row className="gap-6">
            <Avatar name="A" size="xs" />
            <Avatar name="AB" size="sm" />
            <Avatar name="WB" size="md" />
            <Avatar name="Wang Li" size="lg" />
            <Avatar name="Wang Li" size="xl" />
          </Row>
          <div className="mt-4">
            <SubsectionLabel>{t("dataDisplay.avatarGroup")}</SubsectionLabel>
            <AvatarGroup max={4}>
              <Avatar name="Alice" size="sm" />
              <Avatar name="Bob" size="sm" />
              <Avatar name="Charlie" size="sm" />
              <Avatar name="David" size="sm" />
              <Avatar name="Eve" size="sm" />
              <Avatar name="Frank" size="sm" />
            </AvatarGroup>
          </div>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("dataDisplay.breadcrumbPagination")}</SubsectionLabel>
          <Stack>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">{t("dataDisplay.home")}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">{t("dataDisplay.projects")}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Orkest</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t("dataDisplay.current")}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Pagination className="justify-start">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">12</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Stack>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("dataDisplay.accordion")}</SubsectionLabel>
          <Accordion type="single" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t("dataDisplay.whatIs")}</AccordionTrigger>
              <AccordionContent>
                {t("dataDisplay.whatIsDesc")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>{t("dataDisplay.switchTheme")}</AccordionTrigger>
              <AccordionContent>
                {t("dataDisplay.switchThemeDesc")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>{t("dataDisplay.rsc")}</AccordionTrigger>
              <AccordionContent>
                {t("dataDisplay.rscDesc")}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("dataDisplay.result")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("dataDisplay.resultHint")}
          </p>
          <Grid cols={2}>
            <Result status="success">
              <ResultTitle>{t("dataDisplay.resultSuccess")}</ResultTitle>
              <ResultSubtitle>{t("dataDisplay.resultSuccessDesc")}</ResultSubtitle>
              <ResultActions>
                <Button size="sm">{t("dataDisplay.resultBackHome")}</Button>
              </ResultActions>
            </Result>
            <Result status="404">
              <ResultTitle>{t("dataDisplay.resultNotFound")}</ResultTitle>
              <ResultSubtitle>{t("dataDisplay.resultNotFoundDesc")}</ResultSubtitle>
              <ResultActions>
                <Button size="sm" variant="outline">
                  {t("dataDisplay.resultBackHome")}
                </Button>
              </ResultActions>
            </Result>
          </Grid>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("dataDisplay.empty")}</SubsectionLabel>
          <Empty>
            <EmptyIcon>
              <Inbox className="h-12 w-12" />
            </EmptyIcon>
            <EmptyTitle>{t("dataDisplay.emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("dataDisplay.emptyDesc")}</EmptyDescription>
            <EmptyActions>
              <Button>
                <Plus className="h-4 w-4" />
                {t("dataDisplay.newTask")}
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4" />
                {t("dataDisplay.import")}
              </Button>
            </EmptyActions>
          </Empty>
        </Panel>
      </div>
    </Section>
  );
}
