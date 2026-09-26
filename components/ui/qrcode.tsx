"use client";

/**
 * QRCode — real, scannable QR code rendered as SVG.
 *
 * Wraps `qrcode.react`'s QRCodeSVG (full QR spec: versions 1-40, four
 * error-correction levels) while keeping the Orkest-style prop API.
 * By default the dark modules use `currentColor` with the wrapper's color
 * set to the `--foreground` theme token, so the code adapts to Light / Dark /
 * High Contrast modes automatically.
 */
import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

export interface QRCodeProps
  extends Omit<React.SVGProps<SVGSVGElement>, "title"> {
  /** The value to encode. Rendered as `null` when empty. */
  value: string;
  /** Pixel size of the rendered SVG (square). @default 128 */
  size?: number;
  /** Error-correction level. @default "M" */
  level?: "L" | "M" | "Q" | "H";
  /**
   * Color of the dark modules. @default follows the theme foreground token
   * (currentColor resolved against `var(--foreground)`).
   */
  color?: string;
  /** Color of the background. @default "transparent" */
  bgColor?: string;
  /**
   * Quiet-zone margin in modules (0-4). A non-zero margin is required for
   * reliable scanning when the code is rendered edge-to-edge. @default 2
   */
  marginSize?: number;
  /** Accessible title announced by screen readers. @default `QR code for {value}` */
  title?: string;
}

export const QRCode = React.forwardRef<SVGSVGElement, QRCodeProps>(
  (
    {
      value,
      size = 128,
      level = "M",
      color,
      bgColor,
      marginSize = 2,
      title,
      className,
      style,
      ...props
    },
    ref
  ) => {
    if (!value) return null;

    return (
      <QRCodeSVG
        ref={ref}
        value={value}
        size={size}
        level={level}
        marginSize={marginSize}
        fgColor={color ?? "currentColor"}
        bgColor={bgColor ?? "transparent"}
        title={title ?? `QR code for ${value}`}
        className={cn("inline-block", className)}
        style={{ color: "var(--foreground)", ...style }}
        {...props}
      />
    );
  }
);
QRCode.displayName = "QRCode";
