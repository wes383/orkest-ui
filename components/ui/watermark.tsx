"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface WatermarkProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  /** Text or content to render as the watermark. */
  content?: React.ReactNode;
  /** Image URL — when provided, used in place of text. */
  image?: string;
  /** Opacity of the watermark layer (0–1). @default 0.08 */
  opacity?: number;
  /** Rotation in degrees. @default -22 */
  rotate?: number;
  /** Horizontal & vertical gap between tiles, in px. @default 200 */
  gap?: number;
  /** Optional font-size for text content, in px. @default 16 */
  fontSize?: number;
  /** Optional font-weight. @default 500 */
  fontWeight?: number;
  /** Text color (any CSS color). @default "currentColor" */
  color?: string;
  /** When true, the watermark layer is rendered (otherwise nothing is shown). @default true */
  visible?: boolean;
}

function buildSvgDataUrl(
  text: string,
  opts: {
    fontSize: number;
    fontWeight: number;
    color: string;
    rotate: number;
    gap: number;
  }
): string {
  const { fontSize, fontWeight, color, rotate, gap } = opts;
  // SVG with one centered text element; the parent uses background-repeat to tile it.
  const width = gap;
  const height = gap;
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <text x="50%" y="50%" dy="${fontSize / 3}" fill="${color}" font-size="${fontSize}" font-weight="${fontWeight}" font-family="sans-serif" text-anchor="middle" transform="rotate(${rotate} ${width / 2} ${height / 2})">${escaped}</text>
</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

export const Watermark = React.forwardRef<HTMLDivElement, WatermarkProps>(
  (
    {
      className,
      content,
      image,
      opacity = 0.08,
      rotate = -22,
      gap = 200,
      fontSize = 16,
      fontWeight = 500,
      color = "currentColor",
      visible = true,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const bgImage = React.useMemo(() => {
      if (!visible) return undefined;
      if (image) return `url("${image}")`;
      const text =
        typeof content === "string" ? content : content == null ? "" : String(content);
      if (!text) return undefined;
      return buildSvgDataUrl(text, { fontSize, fontWeight, color, rotate, gap });
    }, [visible, image, content, fontSize, fontWeight, color, rotate, gap]);

    const layerStyle: React.CSSProperties = React.useMemo(
      () => ({
        backgroundImage: bgImage,
        backgroundRepeat: "repeat",
        opacity,
        pointerEvents: "none",
      }),
      [bgImage, opacity]
    );

    return (
      <div
        ref={ref}
        className={cn("relative isolate", className)}
        style={style}
        {...props}
      >
        {children}
        {bgImage && (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0"
            style={layerStyle}
          />
        )}
      </div>
    );
  }
);
Watermark.displayName = "Watermark";
