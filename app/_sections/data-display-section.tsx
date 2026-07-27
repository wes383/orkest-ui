"use client";

import * as React from "react";
import { Inbox, Plus, Download } from "lucide-react";
import { Section, Panel, SubsectionLabel, Row, Stack, Grid } from "@/app/_components/demo-helpers";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/tag";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions } from "@/components/ui/empty";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Statistic,
  StatisticLabel,
  StatisticValue,
  StatisticTrend,
  StatisticCard,
} from "@/components/ui/statistic";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/language-provider";

export function DataDisplaySection() {
  const t = useT();

  const tasks = [
    { id: 1, title: t("dataDisplay.task1Title"), priority: "medium" as const, status: t("badges.syncing") },
    { id: 2, title: t("dataDisplay.task2Title"), priority: "high" as const, status: t("forms.disabled") },
    { id: 3, title: t("dataDisplay.task3Title"), priority: "low" as const, status: t("badges.completed") },
    { id: 4, title: t("dataDisplay.task1Title"), priority: "high" as const, status: t("badges.syncing") },
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
            <Card hoverable>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="info">{t("forms.medium")}</Badge>
                </div>
                <CardTitle className="mt-3">{t("dataDisplay.task1Title")}</CardTitle>
                <CardDescription>
                  {t("dataDisplay.task1Desc")}
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-between">
                <span className="text-xs text-foreground-subtle">{t("dataDisplay.task1Time")}</span>
                <AvatarGroup max={2}>
                  <Avatar name="Wang" size="xs" />
                  <Avatar name="Li" size="xs" />
                </AvatarGroup>
              </CardFooter>
            </Card>

            <Card hoverable>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="warning">{t("forms.high")}</Badge>
                </div>
                <CardTitle className="mt-3">{t("dataDisplay.task2Title")}</CardTitle>
                <CardDescription>
                  {t("dataDisplay.task2Desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={60} variant="thin" color="bg-green" />
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-foreground-subtle">{t("dataDisplay.task2Progress")}</span>
                  <span className="text-xs text-foreground-subtle">{t("dataDisplay.task2Time")}</span>
                </div>
              </CardContent>
            </Card>

            <Card hoverable>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{t("forms.low")}</Badge>
                </div>
                <CardTitle className="mt-3">{t("dataDisplay.task3Title")}</CardTitle>
                <CardDescription>
                  {t("dataDisplay.task3Desc")}
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-between">
                <span className="text-xs text-foreground-subtle">{t("dataDisplay.task3Time")}</span>
                <Tag>25min</Tag>
              </CardFooter>
            </Card>
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

        <Grid cols={2}>
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
            <SubsectionLabel>{t("dataDisplay.statistic")}</SubsectionLabel>
            <Grid cols={2}>
              <StatisticCard>
                <StatisticLabel>{t("dataDisplay.weeklyTasks")}</StatisticLabel>
                <StatisticValue>28</StatisticValue>
                <StatisticTrend direction="up" value="+12%" />
              </StatisticCard>
              <StatisticCard>
                <StatisticLabel>{t("dataDisplay.focusHours")}</StatisticLabel>
                <StatisticValue>14.5h</StatisticValue>
                <StatisticTrend direction="up" value="+3.2h" />
              </StatisticCard>
              <StatisticCard>
                <StatisticLabel>{t("dataDisplay.completionRate")}</StatisticLabel>
                <StatisticValue>86%</StatisticValue>
                <StatisticTrend direction="down" value="-4%" />
              </StatisticCard>
              <StatisticCard>
                <StatisticLabel>{t("dataDisplay.streak")}</StatisticLabel>
                <StatisticValue>23 {t("dataDisplay.days")}</StatisticValue>
                <StatisticTrend direction="up" value="+1" />
              </StatisticCard>
            </Grid>
          </Panel>
        </Grid>

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
          <SubsectionLabel>{t("dataDisplay.empty")}</SubsectionLabel>
          <Empty>
            <EmptyIcon>
              <Inbox className="h-10 w-10" />
            </EmptyIcon>
            <EmptyTitle>{t("dataDisplay.emptyTitle")}</EmptyTitle>
            <EmptyDescription>
              {t("dataDisplay.emptyDesc")}
            </EmptyDescription>
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
