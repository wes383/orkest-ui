"use client";

import * as React from "react";
import { Search, Calendar, Folder, Sprout, BookOpen, Dumbbell } from "lucide-react";
import { Section, Panel, SubsectionLabel, Stack, Row, Grid } from "@/app/_components/demo-helpers";
import { Input, InputWithIcon, PasswordInput } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem, RadioCard } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { InputNumber } from "@/components/ui/input-number";
import { PasswordStrength } from "@/components/ui/password-strength";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useLang, useT } from "@/components/language-provider";
import type { Lang } from "@/lib/i18n";

/**
 * The directory the assignee (single) and team-members (multi) fields both read
 * from. Names stay in Latin script in both languages; only the role is
 * translated, so one pool feeds a bilingual demo without a key per person.
 */
const MEMBER_POOL = [
  {
    value: "ava",
    name: "Ava Chen",
    roleZh: "前端工程师",
    roleEn: "Frontend engineer",
    keywords: ["frontend", "ui"],
  },
  {
    value: "marco",
    name: "Marco Rossi",
    roleZh: "产品设计",
    roleEn: "Product designer",
    keywords: ["design", "figma"],
  },
  {
    value: "priya",
    name: "Priya Nair",
    roleZh: "后端工程师",
    roleEn: "Backend engineer",
    keywords: ["backend", "api"],
  },
  {
    value: "sofia",
    name: "Sofia Lindqvist",
    roleZh: "数据分析",
    roleEn: "Data analyst",
    keywords: ["data", "sql"],
  },
  {
    value: "kenji",
    name: "Kenji Watanabe",
    roleZh: "工程经理",
    roleEn: "Engineering manager",
    keywords: ["manager", "lead"],
  },
  {
    value: "daniel",
    name: "Daniel Cho",
    roleZh: "已离职",
    roleEn: "Off-boarded",
    keywords: [],
    disabled: true,
  },
];

/** Labels a project can carry — the creatable list's seed data. */
const LABEL_POOL = [
  { value: "design", zh: "设计", en: "Design" },
  { value: "engineering", zh: "研发", en: "Engineering" },
  { value: "research", zh: "用户研究", en: "Research" },
  { value: "ops", zh: "运维", en: "Ops" },
  { value: "marketing", zh: "市场", en: "Marketing" },
  { value: "docs", zh: "文档", en: "Docs" },
];

/** Keyword lists carry both languages, so either role spelling finds a member. */
function memberOptions(lang: Lang): ComboboxOption[] {
  return MEMBER_POOL.map((member) => ({
    value: member.value,
    label: member.name,
    description: lang === "zh" ? member.roleZh : member.roleEn,
    keywords: [member.roleZh, member.roleEn, ...member.keywords],
    disabled: member.disabled,
  }));
}

function labelOptions(lang: Lang): ComboboxOption[] {
  return LABEL_POOL.map((label) => ({
    value: label.value,
    label: lang === "zh" ? label.zh : label.en,
    keywords: [label.zh, label.en],
  }));
}

/**
 * Stand-in for a search endpoint's data source. Each entry carries both names —
 * so the labels can be localised without a second dictionary — plus a fixed
 * offset, which doubles as the description line.
 */
const CITY_POOL = [
  { value: "beijing", zh: "北京", en: "Beijing", tz: "UTC+8" },
  { value: "shanghai", zh: "上海", en: "Shanghai", tz: "UTC+8" },
  { value: "guangzhou", zh: "广州", en: "Guangzhou", tz: "UTC+8" },
  { value: "shenzhen", zh: "深圳", en: "Shenzhen", tz: "UTC+8" },
  { value: "chengdu", zh: "成都", en: "Chengdu", tz: "UTC+8" },
  { value: "hangzhou", zh: "杭州", en: "Hangzhou", tz: "UTC+8" },
  { value: "wuhan", zh: "武汉", en: "Wuhan", tz: "UTC+8" },
  { value: "xian", zh: "西安", en: "Xi'an", tz: "UTC+8" },
  { value: "nanjing", zh: "南京", en: "Nanjing", tz: "UTC+8" },
  { value: "chongqing", zh: "重庆", en: "Chongqing", tz: "UTC+8" },
  { value: "tokyo", zh: "东京", en: "Tokyo", tz: "UTC+9" },
  { value: "seoul", zh: "首尔", en: "Seoul", tz: "UTC+9" },
  { value: "singapore", zh: "新加坡", en: "Singapore", tz: "UTC+8" },
  { value: "dubai", zh: "迪拜", en: "Dubai", tz: "UTC+4" },
  { value: "london", zh: "伦敦", en: "London", tz: "UTC+0" },
  { value: "paris", zh: "巴黎", en: "Paris", tz: "UTC+1" },
  { value: "berlin", zh: "柏林", en: "Berlin", tz: "UTC+1" },
  { value: "newyork", zh: "纽约", en: "New York", tz: "UTC-5" },
  { value: "sanfrancisco", zh: "旧金山", en: "San Francisco", tz: "UTC-8" },
  { value: "sydney", zh: "悉尼", en: "Sydney", tz: "UTC+10" },
];

/**
 * What the "endpoint" would return: the matching page of results, never the
 * whole pool. The `slice` makes the trigger's label-resolution problem real —
 * a picked city falls off the page as soon as another query is typed.
 */
function searchCities(query: string, lang: Lang): ComboboxOption[] {
  const q = query.trim().toLowerCase();
  return CITY_POOL.filter(
    (city) =>
      !q ||
      city.zh.includes(q) ||
      city.en.toLowerCase().includes(q) ||
      city.value.includes(q) ||
      city.tz.toLowerCase().includes(q)
  )
    .slice(0, 8)
    .map((city) => ({
      value: city.value,
      label: lang === "zh" ? city.zh : city.en,
      description: city.tz,
    }));
}

/**
 * Remote-search demo. There is no backend here: a debounced `setTimeout` plays
 * the part of the request, and the cleanup that clears it plays the part of
 * aborting a superseded one. Everything the component needs from a real data
 * layer is expressed by `shouldFilter={false}` + the controlled query +
 * `loading` + `selectedOption`.
 */
function RemoteCityCombobox() {
  const t = useT();
  const lang = useLang();
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = React.useState<ComboboxOption[]>([]);
  const [loading, setLoading] = React.useState(true);
  // Remembered separately because the picked option leaves `options` on the
  // next query — resolving the label from `options` alone would blank it out.
  const [picked, setPicked] = React.useState<ComboboxOption | null>(null);

  React.useEffect(() => {
    // Only the last keystroke in a burst reaches the endpoint. Clearing the
    // timer on re-run is what keeps a stale response out of `options`.
    const timer = setTimeout(() => {
      setOptions(searchCities(query, lang));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, lang]);

  return (
    <Combobox
      id="combobox-city"
      value={picked?.value ?? ""}
      onValueChange={(next) =>
        setPicked(options.find((option) => option.value === next) ?? null)
      }
      options={options}
      selectedOption={picked}
      loading={loading}
      loadingText={t("forms.loadingCity")}
      // The endpoint already filtered — let cmdk render the page as-is.
      shouldFilter={false}
      searchValue={query}
      onSearchValueChange={(next) => {
        setQuery(next);
        // Set here rather than in the effect: a synchronous setState inside an
        // effect body trips react-hooks/set-state-in-effect.
        setLoading(true);
      }}
      placeholder={t("forms.selectCity")}
      searchPlaceholder={t("forms.searchCity")}
      emptyText={t("forms.noCity")}
    />
  );
}

export function FormsSection() {
  const t = useT();
  const lang = useLang();
  const [password, setPassword] = React.useState("Orkest2024!");
  const [project, setProject] = React.useState("orkest");
  const [assignee, setAssignee] = React.useState("");
  const [members, setMembers] = React.useState<string[]>(["ava", "priya"]);
  const [labels, setLabels] = React.useState<string[]>(["design"]);
  const memberOpts = React.useMemo(() => memberOptions(lang), [lang]);
  const labelOpts = React.useMemo(() => labelOptions(lang), [lang]);
  const rhf = useForm<{ projectName: string; email: string }>({
    defaultValues: { projectName: "", email: "" },
    mode: "onTouched",
  });

  return (
    <Section
      id="forms"
      title={t("forms.title")}
      description={t("forms.description")}
    >
      <Grid cols={2} className="mb-4">
        <Panel>
          <Stack>
            <div>
              <Label htmlFor="task-title">{t("forms.taskTitle")}</Label>
              <Input id="task-title" placeholder={t("forms.taskTitlePlaceholder")} />
            </div>
            <div>
              <Label htmlFor="task-desc">{t("forms.desc")}</Label>
              <Textarea id="task-desc" placeholder={t("forms.descPlaceholder")} />
            </div>
            <div>
              <Label htmlFor="search">{t("forms.withIcon")}</Label>
              <InputWithIcon leadingIcon={<Search className="h-4 w-4" />}>
                <Input id="search" placeholder={t("forms.searchPlaceholder")} />
              </InputWithIcon>
            </div>
            <div>
              <Label htmlFor="disabled-input">{t("forms.disabled")}</Label>
              <Input id="disabled-input" value={t("forms.disabledValue")} disabled />
            </div>
            <div>
              <Label htmlFor="pwd">{t("forms.password")}</Label>
              <PasswordInput id="pwd" placeholder="••••••••" />
            </div>
          </Stack>
        </Panel>

        <Panel>
          <Stack>
            <div>
              <Label>{t("forms.priority")}</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder={t("forms.selectPriority")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("forms.low")}</SelectItem>
                  <SelectItem value="medium">{t("forms.medium")}</SelectItem>
                  <SelectItem value="high">{t("forms.high")}</SelectItem>
                  <SelectItem value="urgent">{t("forms.urgent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("forms.project")}</Label>
              <Select defaultValue="orkest">
                <SelectTrigger>
                  <SelectValue placeholder={t("forms.selectProject")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orkest">{t("forms.orkest")}</SelectItem>
                  <SelectItem value="growth">{t("forms.growth")}</SelectItem>
                  <SelectItem value="reading">{t("forms.reading")}</SelectItem>
                  <SelectItem value="fitness">{t("forms.fitness")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("forms.focusDuration")}</Label>
              <Slider defaultValue={[25]} max={90} min={5} step={5} />
            </div>
            <div>
              <Label>{t("forms.otp")}</Label>
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </Stack>
        </Panel>
      </Grid>

      {/* Date & time pickers get their own block: each one opens a popover, so
          mixing them into the select column made that column hard to scan. */}
      <Panel className="mb-4">
        <SubsectionLabel>{t("forms.dateTimePicker")}</SubsectionLabel>
        <p className="text-xs text-foreground-subtle mb-4">
          {t("forms.dateTimePickerHint")}
        </p>
        <Grid cols={2}>
          <div>
            <Label>{t("forms.reminderTime")}</Label>
            <DateTimePicker aria-label={t("forms.reminderTime")} />
          </div>
          <div>
            <Label>{t("forms.datePicker")}</Label>
            <DatePicker aria-label={t("forms.datePicker")} />
          </div>
          <div>
            <Label>{t("forms.datePickerRange")}</Label>
            <DatePicker mode="range" aria-label={t("forms.datePickerRange")} />
          </div>
          <div>
            <Label>{t("forms.timePicker")}</Label>
            <TimePicker aria-label={t("forms.timePicker")} />
          </div>
        </Grid>
      </Panel>

      {/* Combobox shares the popover-in-a-field shape with the pickers above,
          so it sits in its own block right after them. */}
      <Panel className="mb-4">
        <SubsectionLabel>{t("forms.combobox")}</SubsectionLabel>
        <p className="text-xs text-foreground-subtle mb-4">
          {t("forms.comboboxHint")}
        </p>
        <Grid cols={2}>
          <div>
            <Label>{t("forms.project")}</Label>
            <Combobox
              id="combobox-project"
              value={project}
              onValueChange={setProject}
              placeholder={t("forms.selectProject")}
              searchPlaceholder={t("forms.searchProject")}
              emptyText={t("forms.noProject")}
              options={[
                {
                  value: "orkest",
                  label: t("forms.orkest"),
                  description: t("forms.projectOrkestDesc"),
                  icon: <Folder className="h-4 w-4" />,
                  keywords: ["main"],
                },
                {
                  value: "growth",
                  label: t("forms.growth"),
                  description: t("forms.projectGrowthDesc"),
                  icon: <Sprout className="h-4 w-4" />,
                },
                {
                  value: "reading",
                  label: t("forms.reading"),
                  description: t("forms.projectReadingDesc"),
                  icon: <BookOpen className="h-4 w-4" />,
                  keywords: ["book"],
                },
                {
                  value: "fitness",
                  label: t("forms.fitness"),
                  description: t("forms.projectFitnessDesc"),
                  icon: <Dumbbell className="h-4 w-4" />,
                },
                {
                  value: "archived",
                  label: t("forms.projectArchived"),
                  disabled: true,
                },
              ]}
            />
          </div>
          <div>
            <Label>{t("forms.assignee")}</Label>
            <Combobox
              id="combobox-assignee"
              value={assignee}
              onValueChange={setAssignee}
              placeholder={t("forms.selectAssignee")}
              searchPlaceholder={t("forms.searchAssignee")}
              emptyText={t("forms.noAssignee")}
              options={memberOpts}
            />
          </div>
        </Grid>

        {/* Same component, but the options arrive from a debounced "request"
            instead of a local array. */}
        <div className="mt-6 border-t border-border pt-6">
          <SubsectionLabel>{t("forms.comboboxAsync")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-4">
            {t("forms.comboboxAsyncHint")}
          </p>
          <div className="max-w-sm">
            <Label>{t("forms.city")}</Label>
            <RemoteCityCombobox />
          </div>
        </div>

        {/* Same component again, this time toggling an array of values and
            minting options from typed text. */}
        <div className="mt-6 border-t border-border pt-6">
          <SubsectionLabel>{t("forms.comboboxMultiple")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-4">
            {t("forms.comboboxMultipleHint")}
          </p>
          <Grid cols={2}>
            <div>
              <Label>{t("forms.teamMembers")}</Label>
              <Combobox
                id="combobox-members"
                multiple
                value={members}
                onValueChange={setMembers}
                placeholder={t("forms.selectMembers")}
                searchPlaceholder={t("forms.searchMembers")}
                emptyText={t("forms.noMember")}
                options={memberOpts}
              />
            </div>
            <div>
              <Label>{t("forms.labels")}</Label>
              <Combobox
                id="combobox-labels"
                multiple
                creatable
                value={labels}
                onValueChange={setLabels}
                placeholder={t("forms.selectLabels")}
                searchPlaceholder={t("forms.searchLabels")}
                emptyText={t("forms.noLabel")}
                createText={(typed) => `${t("forms.createLabel")} "${typed}"`}
                options={labelOpts}
              />
            </div>
          </Grid>
        </div>
      </Panel>

      <Panel className="mb-4">
        <Grid cols={2}>
          <div>
            <SubsectionLabel>{t("forms.checkbox")}</SubsectionLabel>
            <CheckboxGroup
              defaultValue={["notify", "sync"]}
              options={[
                { label: t("forms.notify"), value: "notify" },
                { label: t("forms.archive"), value: "archive" },
                { label: t("forms.syncCalendar"), value: "sync" },
                { label: t("forms.disabledOption"), value: "disabled", disabled: true },
              ]}
            />
          </div>
          <div>
            <SubsectionLabel>{t("forms.switch")}</SubsectionLabel>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">{t("forms.darkMode")}</span>
                <Switch defaultChecked />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">{t("forms.weeklyReview")}</span>
                <Switch />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">{t("forms.autoSave")}</span>
                <Switch defaultChecked />
              </label>
              <label className="flex items-center justify-between cursor-not-allowed opacity-50">
                <span className="text-sm">{t("forms.disabled")}</span>
                <Switch disabled />
              </label>
            </div>
          </div>
        </Grid>
      </Panel>

      <Panel>
        <SubsectionLabel>{t("forms.radioCard")}</SubsectionLabel>
        <Grid cols={2}>
          <RadioGroup defaultValue="b">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="a" id="r-a" />
              <label htmlFor="r-a" className="text-sm cursor-pointer">
                {t("forms.optionA")}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="b" id="r-b" />
              <label htmlFor="r-b" className="text-sm cursor-pointer">
                {t("forms.optionB")}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="c" id="r-c" />
              <label htmlFor="r-c" className="text-sm cursor-pointer">
                {t("forms.optionC")}
              </label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <RadioGroup defaultValue="pro">
              <RadioCard value="free" title={t("forms.free")} description={t("forms.freeDesc")} />
              <RadioCard value="pro" title={t("forms.pro")} description={t("forms.proDesc")} />
              <RadioCard
                value="team"
                title={t("forms.team")}
                description={t("forms.teamDesc")}
              />
            </RadioGroup>
          </div>
        </Grid>
      </Panel>

      <Grid cols={2} className="mt-4">
        <Panel>
          <SubsectionLabel>{t("forms.inputNumber")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("forms.inputNumberHint")}
          </p>
          <Stack className="gap-3">
            <div>
              <Label className="mb-1.5 block">{t("forms.quantity")}</Label>
              <InputNumber defaultValue={3} min={1} max={10} />
            </div>
            <div>
              <Label className="mb-1.5 block">{t("forms.focusDuration")}</Label>
              <InputNumber defaultValue={25} min={5} max={120} step={5} />
            </div>
            <div>
              <Label className="mb-1.5 block">{t("forms.disabled")}</Label>
              <InputNumber defaultValue={7} disabled />
            </div>
          </Stack>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("forms.passwordStrength")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("forms.passwordStrengthHint")}
          </p>
          <Stack className="gap-3">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("forms.passwordPlaceholder")}
              aria-label={t("forms.password")}
            />
            <PasswordStrength password={password} showChecklist />
          </Stack>
        </Panel>
      </Grid>

      <Panel className="mt-4">
        <SubsectionLabel>{t("forms.rhfForm")}</SubsectionLabel>
        <p className="text-xs text-foreground-subtle mb-4">
          {t("forms.rhfFormHint")}
        </p>
        <Form {...rhf}>
          <form
            onSubmit={rhf.handleSubmit(() => {})}
            className="max-w-md space-y-4"
            noValidate
          >
            <FormField
              control={rhf.control}
              name="projectName"
              rules={{ required: t("forms.fieldRequired") }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("forms.projectName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("forms.projectNamePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={rhf.control}
              name="email"
              rules={{
                required: t("forms.fieldRequired"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("forms.emailInvalid"),
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("forms.email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("forms.emailPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t("forms.submit")}</Button>
          </form>
        </Form>
      </Panel>
    </Section>
  );
}
