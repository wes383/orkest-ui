"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";
import {
  Panel as ResizablePanelPrimitive,
  PanelGroup as ResizablePanelGroupPrimitive,
  PanelResizeHandle as ResizablePanelResizeHandlePrimitive,
  type PanelGroupProps,
  type PanelProps,
  type PanelResizeHandleProps,
} from "react-resizable-panels";
import { cn } from "@/lib/utils";

export type ResizablePanelGroupProps = React.ComponentProps<
  typeof ResizablePanelGroupPrimitive
>;

export function ResizablePanelGroup({
  className,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <ResizablePanelGroupPrimitive
      className={cn(
        "group flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  );
}

export type ResizablePanelProps = React.ComponentProps<
  typeof ResizablePanelPrimitive
>;

export function ResizablePanel({ className, ...props }: ResizablePanelProps) {
  return <ResizablePanelPrimitive className={cn(className)} {...props} />;
}

export interface ResizableHandleProps
  extends React.ComponentProps<typeof ResizablePanelResizeHandlePrimitive> {
  withHandle?: boolean;
}

export function ResizableHandle({
  className,
  children,
  withHandle = false,
  ...props
}: ResizableHandleProps) {
  return (
    <ResizablePanelResizeHandlePrimitive
      className={cn(
        "relative flex w-px items-center justify-center bg-border transition-colors",
        "hover:bg-border-strong",
        "data-[resize-handle-state=drag]:bg-accent data-[resize-handle-state=hover]:bg-border-strong",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 after:content-['']",
        "group-data-[panel-group-direction=vertical]:h-px group-data-[panel-group-direction=vertical]:w-full group-data-[panel-group-direction=vertical]:after:h-1 group-data-[panel-group-direction=vertical]:after:w-full group-data-[panel-group-direction=vertical]:after:left-0 group-data-[panel-group-direction=vertical]:after:top-1/2 group-data-[panel-group-direction=vertical]:after:-translate-y-1/2 group-data-[panel-group-direction=vertical]:after:translate-x-0",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-border bg-surface">
          <GripVertical className="h-2.5 w-2.5 text-foreground-subtle" />
        </div>
      )}
      {children}
    </ResizablePanelResizeHandlePrimitive>
  );
}

export { type PanelGroupProps, type PanelProps, type PanelResizeHandleProps };
