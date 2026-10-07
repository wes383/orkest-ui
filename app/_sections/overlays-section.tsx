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
  FolderInput,
  FileDown,
} from "lucide-react";
import { Section, Panel, SubsectionLabel, Row, Grid, Stack } from "@/app/_components/demo-helpers";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogBody,
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
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  ContextMenuCheckboxItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar } from "@/components/ui/avatar";
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
  DrawerBody,
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
  const [contextShowDone, setContextShowDone] = React.useState(true);
  const [contextPicked, setContextPicked] = React.useState<string | null>(null);

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
              <DialogBody className="space-y-4">
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
              </DialogBody>
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

            {/* Hover-triggered, and the panel holds more than one line — the
                two things that separate this from the Tooltip above. */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline">
                  <User className="h-4 w-4" />
                  {t("overlays.hoverMember")}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <div className="flex items-start gap-3">
                  <Avatar name="Ava Chen" size="md" />
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-sm font-medium">Ava Chen</div>
                    <div className="text-xs text-foreground-muted">
                      {t("overlays.memberRole")}
                    </div>
                    <div className="text-xs text-foreground-subtle">
                      {t("overlays.memberMeta")}
                    </div>
                  </div>
                </div>
                <div className="mt-3 border-t border-border pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    {t("overlays.viewProfile")}
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>
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
        <SubsectionLabel>{t("overlays.contextMenu")}</SubsectionLabel>
        <p className="text-xs text-foreground-subtle mb-3">
          {t("overlays.contextMenuHint")}
        </p>
        <ContextMenu>
          {/* Radix renders the trigger as a <span>, so the demo area only ever
              uses spans (a <p> inside a <span> is not valid phrasing content). */}
          <ContextMenuTrigger className="block select-none rounded-lg border border-dashed border-border bg-hover-bg px-6 py-8 text-center">
            <span className="block text-sm text-foreground-muted">
              {t("overlays.contextMenuArea")}
            </span>
            {contextPicked && (
              <span className="mt-2 inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-foreground">
                {contextPicked}
              </span>
            )}
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuLabel>{t("overlays.action")}</ContextMenuLabel>
            <ContextMenuItem
              onSelect={() => setContextPicked(t("overlays.edit"))}
            >
              <Edit className="h-4 w-4" />
              {t("overlays.edit")}
              <ContextMenuShortcut>⌘E</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={() => setContextPicked(t("overlays.copy"))}
            >
              <Copy className="h-4 w-4" />
              {t("overlays.copy")}
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuSeparator />

            {/* Second level — a plain submenu. */}
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <FolderInput className="h-4 w-4" />
                {t("overlays.moveTo")}
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-44">
                <ContextMenuItem
                  onSelect={() => setContextPicked(t("overlays.moveInbox"))}
                >
                  {t("overlays.moveInbox")}
                </ContextMenuItem>
                <ContextMenuItem
                  onSelect={() => setContextPicked(t("overlays.moveDoing"))}
                >
                  {t("overlays.moveDoing")}
                </ContextMenuItem>
                <ContextMenuItem
                  onSelect={() => setContextPicked(t("overlays.moveDone"))}
                >
                  {t("overlays.moveDone")}
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>

            {/* Second level again — a menu can hold more than one submenu. */}
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <FileDown className="h-4 w-4" />
                {t("overlays.exportAs")}
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-44">
                <ContextMenuItem onSelect={() => setContextPicked("Markdown")}>
                  Markdown
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => setContextPicked("PDF")}>
                  PDF
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => setContextPicked("PNG")}>
                  PNG
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSeparator />

            <ContextMenuCheckboxItem
              checked={contextShowDone}
              onCheckedChange={setContextShowDone}
            >
              {t("overlays.showCompleted")}
            </ContextMenuCheckboxItem>

            <ContextMenuSeparator />

            <ContextMenuItem
              variant="destructive"
              onSelect={() => setContextPicked(t("buttons.delete"))}
            >
              <Trash className="h-4 w-4" />
              {t("buttons.delete")}
              <ContextMenuShortcut>⌫</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Panel>

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
            <DrawerBody className="space-y-4">
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
            </DrawerBody>
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
