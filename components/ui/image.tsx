"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export const imageRounded = cva("", {
  variants: {
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    rounded: "md",
  },
});

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "placeholder">,
    VariantProps<typeof imageRounded> {
  fallback?: React.ReactNode;
  placeholder?: "skeleton" | "blur";
  aspectRatio?: number;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      src,
      alt,
      width,
      height,
      rounded,
      fallback,
      placeholder = "skeleton",
      aspectRatio,
      onLoad,
      onError,
      ...props
    },
    ref
  ) => {
    const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
      src ? "loading" : "error"
    );

    React.useEffect(() => {
      if (src) setStatus("loading");
      else setStatus("error");
    }, [src]);

    const showFallback = status === "error";
    const showPlaceholder = status === "loading" && placeholder;

    const aspectStyle: React.CSSProperties | undefined = aspectRatio
      ? { aspectRatio: String(aspectRatio) }
      : undefined;

    return (
      <span
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden bg-muted",
          imageRounded({ rounded }),
          className
        )}
        style={{ width, height, ...aspectStyle }}
      >
        {showFallback ? (
          <span className="flex h-full w-full items-center justify-center text-foreground-faint">
            {fallback ?? (
              <svg
                className="h-1/3 w-1/3 opacity-60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            )}
          </span>
        ) : (
          <>
            {showPlaceholder === "skeleton" && (
              <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
            )}
            {showPlaceholder === "blur" && status === "loading" && (
              <span className="absolute inset-0 animate-pulse-soft bg-hover-bg-strong" />
            )}
            <img
              ref={ref}
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading={props.loading ?? "lazy"}
              onLoad={(e) => {
                setStatus("loaded");
                onLoad?.(e);
              }}
              onError={(e) => {
                setStatus("error");
                onError?.(e);
              }}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-base ease-out",
                status === "loaded" ? "opacity-100" : "opacity-0"
              )}
              {...props}
            />
          </>
        )}
      </span>
    );
  }
);
Image.displayName = "Image";

export interface CoverImageProps
  extends Omit<ImageProps, "aspectRatio"> {
  ratio?: number;
}

export const CoverImage = React.forwardRef<HTMLImageElement, CoverImageProps>(
  ({ className, ratio = 1, ...props }, ref) => (
    <Image
      ref={ref}
      aspectRatio={ratio}
      className={cn("w-full", className)}
      {...props}
    />
  )
);
CoverImage.displayName = "CoverImage";
