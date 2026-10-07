"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { cn } from "@/lib/utils";
import { useDensity, type Density } from "@/components/density-provider";

/** Size tier of a single OTP slot, mirroring Input's size scale. */
export type InputOTPSize = "xs" | "sm" | "md" | "lg";

const INPUT_OTP_SIZE: Record<
  InputOTPSize,
  { slot: string; caret: string }
> = {
  // Radius lives here so the compact slot (32px) stays a rounded rect.
  //
  // Width only, plus `aspect-square` — never a fixed height. A six-slot row is
  // wider than a phone's content box, so the slots have to be able to shrink,
  // and a fixed height would turn them into tall slivers as they do. At md the
  // slot is still 48×48, so nothing changes on a wide screen; it only gives
  // when the row runs out of room.
  xs: { slot: "w-8 aspect-square rounded-md text-sm", caret: "h-4" },
  sm: { slot: "w-10 aspect-square rounded-lg text-base", caret: "h-5" },
  md: { slot: "w-12 aspect-square rounded-lg text-lg", caret: "h-5" },
  lg: { slot: "w-14 aspect-square rounded-lg text-xl", caret: "h-6" },
};

/** Size used when no explicit `size` is given, derived from the global density. */
const INPUT_OTP_SIZE_FOR_DENSITY: Record<Density, InputOTPSize> = {
  compact: "xs",
  default: "md",
  comfortable: "lg",
};

export interface InputOTPProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof OTPInput>,
    "children" | "render"
  > {
  maxLength: number;
  /** Children to render inside the OTP input (typically InputOTPGroup + InputOTPSlot). */
  children?: React.ReactNode;
}

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  InputOTPProps
>(({ className, containerClassName, children, ...props }, ref) => {
  const globalDensity = useDensity();
  return (
    <OTPInput
      ref={ref}
      // `min-w-0`: the row must be allowed to shrink below its content, or a
      // narrow container is overflowed instead of the slots shrinking.
      containerClassName={cn(
        "flex min-w-0 items-center",
        globalDensity === "compact" ? "gap-1.5" : "gap-2",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    >
      {children ?? <span />}
    </OTPInput>
  );
});
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  const globalDensity = useDensity();
  return (
    <div
      ref={ref}
      /**
       * `min-w-0` is load-bearing. A nested flex container's automatic minimum
       * size resolves from its children, so a group of fixed-width slots
       * refuses to shrink and takes the row's overflow with it — the row then
       * spills out of its card instead of compressing.
       */
      className={cn(
        "flex min-w-0 items-center",
        globalDensity === "compact" ? "gap-1.5" : "gap-2",
        className
      )}
      {...props}
    />
  );
});
InputOTPGroup.displayName = "InputOTPGroup";

export interface InputOTPSlotProps
  extends React.ComponentPropsWithoutRef<"div"> {
  index: number;
  /** Slot size. Omit to follow the global density tier. */
  size?: InputOTPSize;
}

const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ index, size, className, ...props }, ref) => {
    const ctx = React.useContext(OTPInputContext);
    const globalDensity = useDensity();
    const sizing = INPUT_OTP_SIZE[size ?? INPUT_OTP_SIZE_FOR_DENSITY[globalDensity]];
    const slot = ctx?.slots?.[index];
    const char = slot?.char ?? null;
    const hasFakeCaret = slot?.hasFakeCaret ?? false;
    const isActive = slot?.isActive ?? false;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex min-w-0 shrink items-center justify-center border border-border bg-surface text-center font-medium text-foreground transition-colors",
          sizing.slot,
          "data-[active=true]:border-border-strong data-[active=true]:ring-2 data-[active=true]:ring-ring data-[active=true]:ring-offset-2 data-[active=true]:ring-offset-background",
          className
        )}
        data-active={isActive ? "true" : undefined}
        {...props}
      >
        {char !== null ? <span className="leading-none">{char}</span> : null}
        {hasFakeCaret && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "w-px animate-pulse-soft bg-foreground",
                sizing.caret
              )}
            />
          </span>
        )}
      </div>
    );
  }
);
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ className, children = "—", ...props }, ref) => {
  const globalDensity = useDensity();
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation="vertical"
      className={cn(
        "flex items-center justify-center text-foreground-subtle",
        globalDensity === "compact" ? "mx-1" : "mx-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
