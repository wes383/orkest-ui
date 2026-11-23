// Chip colours within this distance of a theme surface disappear into it: white chips on
// the white page, near-black chips on the near-black page.
const lightChannelThreshold = 0xe8;
const darkChannelThreshold = 0x1c;

function channels(value: string): number[] | null {
  const hex = value.trim().replace('#', '');

  if (hex.length !== 6) {
    return null;
  }

  return [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
}

/** True when a chip needs a hairline to be distinguishable from either theme's surface. */
export function needsSwatchOutline(value: string): boolean {
  const rgb = channels(value);

  if (!rgb) {
    return false;
  }

  const isLight = rgb.every((channel) => channel >= lightChannelThreshold);
  const isDark = rgb.every((channel) => channel <= darkChannelThreshold);

  return isLight || isDark;
}

const colorValuePattern = /^(#|rgba?\(|hsla?\(|hwb\(|lab\(|lch\(|oklab\(|oklch\(|color\()/i;

/** Tokens such as `--ui-focus-halo` hold a shadow shorthand, not a colour. */
export function isColorValue(value: string): boolean {
  return colorValuePattern.test(value.trim());
}
