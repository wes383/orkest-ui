"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: CarouselOptions;
  plugins?: Parameters<typeof useEmblaCarousel>[1];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}

export type CarouselContextType = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
};

const CarouselContext = React.createContext<CarouselContextType | null>(null);

export function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return ctx;
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      orientation = "horizontal",
      opts = { loop: false, align: "start" },
      plugins,
      setApi,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((emblaApi: CarouselApi) => {
      if (!emblaApi) return;
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          orientation,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          /**
           * Three-track grid: the viewport takes the middle track, the prev/next
           * buttons get the outer ones. Grid placement is used instead of
           * `order-*` so the buttons sit on the correct side even though they are
           * authored *after* <CarouselContent> in the markup.
           *
           * Every child pins BOTH its row and its column. Pinning the column
           * alone is not enough: in the auto-placement algorithm a step back in
           * column (2 -> 1 for the prev button) bumps the cursor to the next row,
           * so the buttons would land on a second row instead of sharing the
           * content's row — and `items-center` then has nothing to center against.
           */
          className={cn(
            "relative grid items-center gap-2",
            orientation === "horizontal"
              ? "grid-cols-[auto_minmax(0,1fr)_auto]"
              : "grid-rows-[auto_minmax(0,1fr)_auto]",
            className
          )}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

export interface CarouselContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  CarouselContentProps
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div
      ref={carouselRef}
      className={cn(
        "min-w-0 overflow-hidden",
        orientation === "horizontal"
          ? "col-start-2 row-start-1"
          : "col-start-1 row-start-2"
      )}
    >
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

export interface CarouselItemProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  CarouselItemProps
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

export interface CarouselPreviousProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  CarouselPreviousProps
>(({ className, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Previous slide"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-border shadow-pop transition-colors duration-base ease-out",
        "hover:bg-hover-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "shrink-0",
        orientation === "horizontal"
          ? "col-start-1 row-start-1"
          : "col-start-1 row-start-1 justify-self-center rotate-90",
        className
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

export interface CarouselNextProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  CarouselNextProps
>(({ className, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Next slide"
      disabled={!canScrollNext}
      onClick={scrollNext}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-border shadow-pop transition-colors duration-base ease-out",
        "hover:bg-hover-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "shrink-0",
        orientation === "horizontal"
          ? "col-start-3 row-start-1"
          : "col-start-1 row-start-3 justify-self-center rotate-90",
        className
      )}
      {...props}
    >
      <ChevronRight className="h-4 w-4" aria-hidden="true" />
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";
