"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { cn } from "@/lib/utils";

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
>(({ className, containerClassName, children, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2", containerClassName)}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  >
    {children ?? <span />}
  </OTPInput>
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
));
InputOTPGroup.displayName = "InputOTPGroup";

export interface InputOTPSlotProps
  extends React.ComponentPropsWithoutRef<"div"> {
  index: number;
}

const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ index, className, ...props }, ref) => {
    const ctx = React.useContext(OTPInputContext);
    const slot = ctx?.slots?.[index];
    const char = slot?.char ?? null;
    const hasFakeCaret = slot?.hasFakeCaret ?? false;
    const isActive = slot?.isActive ?? false;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface text-center text-lg font-medium text-foreground transition-colors",
          "data-[active=true]:border-border-strong data-[active=true]:ring-2 data-[active=true]:ring-ring data-[active=true]:ring-offset-2 data-[active=true]:ring-offset-background",
          className
        )}
        data-active={isActive ? "true" : undefined}
        {...props}
      >
        {char !== null ? <span className="leading-none">{char}</span> : null}
        {hasFakeCaret && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="h-5 w-px animate-pulse-soft bg-foreground" />
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
>(({ className, children = "—", ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    aria-orientation="vertical"
    className={cn(
      "mx-2 flex items-center justify-center text-foreground-subtle",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
