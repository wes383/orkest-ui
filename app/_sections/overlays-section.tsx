"use client";

import * as React from "react";
import {
  Plus,
  Edit,
  Copy,
  Download,
  Trash,
  User,
  Settings,
  LogOut,
  Info,
  Check,
  Calendar,
  Search,
} from "lucide-react";
import { Section, Panel, SubsectionLabel, Row, Grid, Stack } from "@/app/_components/demo-helpers";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Popconfirm,
  PopconfirmTrigger,
  PopconfirmContent,
  PopconfirmTitle,
  PopconfirmDescription,
} from "@/components/ui/popconfirm";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { useT } from "@/components/language-provider";

export function OverlaysSection() {
  const t = useT();
  const [checkboxVal, setCheckboxVal] = React.useState(true);
  const [radioVal, setRadioVal] = React.useState("created");
  const [commandOpen, setCommandOpen] = React.useState(false);

  return (
    <Section
      id="overlays"
      title={t("overlays.title")}
      description={t("overlays.description")}
    >
      <Panel className="mb-4">
        <SubsectionLabel>{t("overlays.dialog")}</SubsectionLabel>
        <Row>
          <Dialog>
            <DialogTrigger asChild>
              <Button>{t("overlays.openModal")}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[560px]">
              <DialogHeader>
                <DialogTitle>{t("overlays.newTask")}</DialogTitle>
                <DialogDescription>
                  {t("overlays.newTaskDesc")}
                </DialogDescription>
              </DialogHeader>
              <div className="px-7 pb-2 space-y-4">
                <div>
                  <Label htmlFor="modal-title">{t("overlays.titleLabel")}</Label>
                  <Input id="modal-title" placeholder={t("overlays.taskName")} />
                </div>
                <div>
                  <Label htmlFor="modal-desc">{t("overlays.descLabel")}</Label>
                  <Textarea id="modal-desc" placeholder={t("overlays.descPlaceholder")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("overlays.priority")}</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label className="mb-1.5 block">
                      {t("overlays.dueTime")}
                    </Label>
                    <DateTimePicker aria-label={t("overlays.dueTime")} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">{t("overlays.cancel")}</Button>
                </DialogClose>
                <Button>{t("overlays.createTask")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="danger">{t("overlays.deleteProject")}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("overlays.deleteProgress")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("overlays.deleteConfirm")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("overlays.cancel")}</AlertDialogCancel>
                <AlertDialogAction destructive>{t("buttons.delete")}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">{t("overlays.archiveTask")}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("overlays.archiveTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("overlays.archiveDesc")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("overlays.cancel")}</AlertDialogCancel>
                <AlertDialogAction>{t("overlays.archive")}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Row>
      </Panel>

      <Panel className="mb-4">
        <SubsectionLabel>{t("overlays.tooltipPopover")}</SubsectionLabel>
        <TooltipProvider>
          <Row>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="help">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("overlays.viewHelp")}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">{t("overlays.hoverMe")}</Button>
              </TooltipTrigger>
              <TooltipContent>{t("overlays.tooltipText")}</TooltipContent>
            </Tooltip>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Calendar className="h-4 w-4" />
                  {t("overlays.quickCreate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground">
                    {t("overlays.quickCreateTitle")}
                  </div>
                  <Input placeholder={t("overlays.taskTitlePlaceholder")} />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      {t("overlays.cancel")}
                    </Button>
                    <Button size="sm">{t("overlays.create")}</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </Row>
        </TooltipProvider>
      </Panel>

      <Grid cols={3}>
        <Panel>
          <SubsectionLabel>{t("overlays.actionMenu")}</SubsectionLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>{t("overlays.action")}</span>
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>{t("overlays.action")}</DropdownMenuLabel>
              <DropdownMenuItem>
                <Edit className="h-4 w-4" />
                {t("overlays.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4" />
                {t("overlays.copy")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4" />
                {t("buttons.export")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash className="h-4 w-4" />
                {t("buttons.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("overlays.userMenu")}</SubsectionLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>{t("overlays.account")}</span>
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>{t("overlays.account")}</DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="h-4 w-4" />
                {t("overlays.profile")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4" />
                {t("overlays.settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut className="h-4 w-4" />
                {t("overlays.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("overlays.sortMenu")}</SubsectionLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>{t("overlays.sortBy")}</span>
                <Check className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>{t("overlays.sortBy")}</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={radioVal}
                onValueChange={setRadioVal}
              >
                <DropdownMenuRadioItem value="created">
                  {t("overlays.createdTime")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="due">{t("overlays.dueDate")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="priority">{t("overlays.priority")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="alpha">{t("overlays.alphabetical")}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={checkboxVal}
                onCheckedChange={setCheckboxVal}
              >
                {t("overlays.showCompleted")}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Panel>
      </Grid>

      <Panel className="mt-4">
        <SubsectionLabel>{t("overlays.drawer")}</SubsectionLabel>
        <p className="text-xs text-foreground-subtle mb-3">
          {t("overlays.drawerHint")}
        </p>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">{t("overlays.openDrawer")}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t("overlays.drawerTitle")}</DrawerTitle>
              <DrawerDescription>{t("overlays.drawerBody")}</DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 px-5 pb-4">
              <div>
                <Label htmlFor="drawer-title" className="mb-1.5 block">
                  {t("overlays.titleLabel")}
                </Label>
                <Input id="drawer-title" defaultValue={t("overlays.newTask")} />
              </div>
              <div>
                <Label htmlFor="drawer-desc" className="mb-1.5 block">
                  {t("overlays.descLabel")}
                </Label>
                <Textarea
                  id="drawer-desc"
                  placeholder={t("overlays.descPlaceholder")}
                />
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="ghost">{t("overlays.cancel")}</Button>
              </DrawerClose>
              <Button>{t("overlays.save")}</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Panel>

      <Panel className="mt-4">
        <SubsectionLabel>{t("overlays.popconfirm")}</SubsectionLabel>
        <p className="text-xs text-foreground-subtle mb-3">
          {t("overlays.popconfirmHint")}
        </p>
        <Popconfirm>
          <PopconfirmTrigger asChild>
            <Button variant="danger">{t("overlays.deleteTask")}</Button>
          </PopconfirmTrigger>
          <PopconfirmContent
            destructive
            confirmText={t("buttons.delete")}
            cancelText={t("overlays.cancel")}
          >
            <PopconfirmTitle>{t("overlays.deleteTask")}</PopconfirmTitle>
            <PopconfirmDescription>
              {t("overlays.popconfirmQuestion")}
            </PopconfirmDescription>
          </PopconfirmContent>
        </Popconfirm>
      </Panel>

      <Panel className="mt-4">
        <SubsectionLabel>{t("overlays.command")}</SubsectionLabel>
        <p className="text-xs text-foreground-subtle mb-3">
          {t("overlays.commandHint")}
        </p>
        <Row>
          <Button variant="outline" onClick={() => setCommandOpen(true)}>
            {t("overlays.openCommandPalette")}
          </Button>
          <span className="inline-flex items-center gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        </Row>
        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <CommandInput placeholder={t("overlays.commandPlaceholder")} />
          <CommandList>
            <CommandEmpty>{t("overlays.commandNoResults")}</CommandEmpty>
            <CommandGroup heading={t("overlays.action")}>
              <CommandItem>
                <Plus className="h-4 w-4" />
                {t("overlays.cmdNewTask")}
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Search className="h-4 w-4" />
                {t("overlays.cmdSearchTasks")}
                <CommandShortcut>⌘F</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings className="h-4 w-4" />
                {t("overlays.cmdOpenSettings")}
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem>
                <LogOut className="h-4 w-4" />
                {t("overlays.cmdLogout")}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Panel>
    </Section>
  );
}
