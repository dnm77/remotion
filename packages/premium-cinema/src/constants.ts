export const COLORS = {
  bg: "#050505",
  white: "#F5F5F5",
  yellow: "#FFF800",
  yellowGlow: "rgba(255, 248, 0, 0.6)",
  yellowDim: "rgba(255, 248, 0, 0.25)",
} as const;

// Helvetica Neue on macOS, Helvetica on Linux, Arial fallback
export const FONT =
  '"Helvetica Neue", Helvetica, "Arial", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';

// Interpolate between white (#F5F5F5) and yellow (#FFF800)
export function lerpColor(t: number): string {
  const r = Math.round(245 + (255 - 245) * t);
  const g = Math.round(245 + (248 - 245) * t);
  const b = Math.round(245 * (1 - t));
  return `rgb(${r},${g},${b})`;
}
