/**
 * QRCode — pure-SVG stylized QR-like code generator.
 *
 * NOTE: This is a *deterministic placeholder* that LOOKS like a QR code.
 * It is built from a stable hash of the input string and includes
 * QR-style finder patterns (the three corner squares) so the visual
 * language is correct. For production scanning of arbitrary payloads,
 * integrate a proper QR library (e.g. `qrcode`) — see comment below.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface QRCodeProps extends React.SVGProps<SVGSVGElement> {
  /** The value to encode (drives the deterministic pattern). */
  value: string;
  /** Pixel size of the rendered SVG (square). @default 128 */
  size?: number;
  /** Error-correction level — accepted for API parity; visual output is the same. @default "M" */
  level?: "L" | "M" | "Q" | "H";
  /** Color of the dark modules. @default "#25242a" */
  color?: string;
  /** Color of the background. @default "transparent" */
  bgColor?: string;
}

/** 32-bit FNV-1a hash — stable across runs for the same input. */
function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Mulberry32 PRNG seeded from the hash so the pattern is deterministic. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GRID = 25; // 25×25 modules — small but QR-like

/** Render a 7×7 finder pattern anchored at (r0, c0). */
function renderFinder(
  r0: number,
  c0: number,
  cell: number,
  color: string
): React.ReactNode {
  const x = c0 * cell;
  const y = r0 * cell;
  const s = cell * 7;
  return (
    <g key={`finder-${r0}-${c0}`} shapeRendering="crispEdges">
      <rect x={x} y={y} width={s} height={s} fill={color} />
      <rect
        x={x + cell}
        y={y + cell}
        width={s - 2 * cell}
        height={s - 2 * cell}
        fill="transparent"
      />
      <rect
        x={x + 2 * cell}
        y={y + 2 * cell}
        width={3 * cell}
        height={3 * cell}
        fill={color}
      />
    </g>
  );
}

export const QRCode = React.forwardRef<SVGSVGElement, QRCodeProps>(
  (
    {
      value,
      size = 128,
      level = "M",
      color = "#25242a",
      bgColor = "transparent",
      className,
      ...props
    },
    ref
  ) => {
    const cell = size / GRID;
    const seed = fnv1a(`${value}::${level}`);
    const rand = mulberry32(seed);

    // Pre-compute the data modules (skip finder areas + their 1-module separators).
    const modules: { x: number; y: number }[] = [];
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        // 1-module quiet zone around each finder
        const nearFinder =
          (r < 8 && c < 8) ||
          (r < 8 && c >= GRID - 8) ||
          (r >= GRID - 8 && c < 8);
        if (nearFinder) continue;
        if (rand() > 0.5) modules.push({ x: c * cell, y: r * cell });
      }
    }

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`QR code for ${value}`}
        className={cn("inline-block", className)}
        shapeRendering="crispEdges"
        {...props}
      >
        {bgColor !== "transparent" && (
          <rect width={size} height={size} fill={bgColor} />
        )}
        {modules.map((m, i) => (
          <rect
            key={i}
            x={m.x}
            y={m.y}
            width={cell}
            height={cell}
            fill={color}
          />
        ))}
        {renderFinder(0, 0, cell, color)}
        {renderFinder(0, GRID - 7, cell, color)}
        {renderFinder(GRID - 7, 0, cell, color)}
      </svg>
    );
  }
);
QRCode.displayName = "QRCode";
