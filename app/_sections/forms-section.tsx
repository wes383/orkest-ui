"use client";

import * as React from "react";
import { Search, Calendar } from "lucide-react";
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
import { useT } from "@/components/language-provider";

export function FormsSection() {
  const t = useT();
  const [password, setPassword] = React.useState("Orkest2024!");
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
