"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { useDensity, type Density } from "@/components/density-provider";

/** Density tiers for the slider track and thumb. */
export type SliderDensity = Density;

const sliderTrackVariants = {
  compact: "h-1",
  default: "h-1.5",
  comfortable: "h-2",
} as const;

const sliderThumbVariants = {
  compact: "h-3.5 w-3.5",
  default: "h-4 w-4",
  comfortable: "h-5 w-5",
} as const;

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbClassName?: string;
  trackClassName?: string;
  rangeClassName?: string;
  /** Track / thumb density. Falls back to the surrounding density. */
  density?: SliderDensity;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      thumbClassName,
      trackClassName,
      rangeClassName,
      density,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const globalDensity = useDensity();
    const resolvedDensity = density ?? globalDensity;
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
            "relative w-full grow overflow-hidden rounded-full bg-hover-bg-strong",
            sliderTrackVariants[resolvedDensity],
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
              "block rounded-full bg-surface border-2 border-accent shadow-sm hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
              sliderThumbVariants[resolvedDensity],
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
