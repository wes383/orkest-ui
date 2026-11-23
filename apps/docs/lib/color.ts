const lightChannelThreshold = 0xe8;

/** True for colours close enough to white that they need an outline to be visible. */
export function isLightColor(value: string): boolean {
  const hex = value.trim().replace('#', '');

  if (hex.length !== 6) {
    return false;
  }

  return [0, 2, 4].every(
    (index) => Number.parseInt(hex.slice(index, index + 2), 16) >= lightChannelThreshold,
  );
}
