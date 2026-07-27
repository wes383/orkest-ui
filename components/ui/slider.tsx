"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbClassName?: string;
  trackClassName?: string;
  rangeClassName?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    { className, thumbClassName, trackClassName, rangeClassName, value, defaultValue, ...props },
    ref
  ) => {
    const values = value ?? defaultValue;
    const thumbCount = Array.isArray(values) ? values.length : 1;

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        value={value}
        defaultValue={defaultValue}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative h-1.5 w-full grow overflow-hidden rounded-full bg-hover-bg-strong",
            trackClassName
          )}
        >
          <SliderPrimitive.Range
            className={cn("absolute h-full rounded-full bg-accent", rangeClassName)}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }).map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className={cn(
              "block h-4 w-4 rounded-full bg-surface border-2 border-accent shadow-sm hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
              thumbClassName
            )}
          />
        ))}
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = SliderPrimitive.Root.displayName;

const RangeSlider = Slider;
RangeSlider.displayName = "RangeSlider";

export { Slider, RangeSlider };
