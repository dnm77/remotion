import React from "react";
import { COLORS, FONT } from "../constants";

// ─── Corner Brackets ───────────────────────────────────────────────────────

const BRACKET = 44;
const WEIGHT = 1.5;
const MARGIN = 52;

const Bracket: React.FC<{
  top?: number | "auto";
  bottom?: number | "auto";
  left?: number | "auto";
  right?: number | "auto";
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;
  opacity: number;
}> = ({ opacity, ...style }) => (
  <div
    style={{
      position: "absolute",
      width: BRACKET,
      height: BRACKET,
      opacity,
      ...style,
    }}
  />
);

export const UICorners: React.FC<{ opacity: number }> = ({ opacity }) => {
  const border = `${WEIGHT}px solid ${COLORS.white}`;
  return (
    <>
      <Bracket
        top={MARGIN}
        left={MARGIN}
        borderTop={border}
        borderLeft={border}
        opacity={opacity}
      />
      <Bracket
        top={MARGIN}
        right={MARGIN}
        borderTop={border}
        borderRight={border}
        opacity={opacity}
      />
      <Bracket
        bottom={MARGIN}
        left={MARGIN}
        borderBottom={border}
        borderLeft={border}
        opacity={opacity}
      />
      <Bracket
        bottom={MARGIN}
        right={MARGIN}
        borderBottom={border}
        borderRight={border}
        opacity={opacity}
      />
    </>
  );
};

// ─── Scan Line ─────────────────────────────────────────────────────────────

export const ScanLine: React.FC<{ y: number; opacity: number }> = ({
  y,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y,
      height: 1,
      background: `linear-gradient(90deg,
        transparent 0%,
        ${COLORS.white}18 12%,
        ${COLORS.yellow}90 50%,
        ${COLORS.white}18 88%,
        transparent 100%)`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

// ─── Subtle Background Grid ────────────────────────────────────────────────

export const GridLines: React.FC<{ opacity?: number; count?: number }> = ({
  opacity = 0.035,
  count = 9,
}) => (
  <div
    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    aria-hidden
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${((i + 1) / (count + 1)) * 100}%`,
          height: 1,
          backgroundColor: COLORS.white,
          opacity,
        }}
      />
    ))}
  </div>
);

// ─── Scene Label (top-left) ────────────────────────────────────────────────

export const SceneLabel: React.FC<{
  label: string;
  index: string;
  opacity: number;
}> = ({ label, index, opacity }) => (
  <div
    style={{
      position: "absolute",
      top: MARGIN + 4,
      left: MARGIN + 52,
      opacity,
      display: "flex",
      alignItems: "center",
      gap: 16,
    }}
  >
    <span
      style={{
        fontFamily: FONT,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.22em",
        color: COLORS.yellow,
        textTransform: "uppercase",
      }}
    >
      {index}
    </span>
    <span
      style={{
        width: 24,
        height: 1,
        backgroundColor: COLORS.white,
        opacity: 0.4,
        display: "inline-block",
      }}
    />
    <span
      style={{
        fontFamily: FONT,
        fontSize: 11,
        fontWeight: 400,
        letterSpacing: "0.18em",
        color: COLORS.white,
        opacity: 0.5,
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  </div>
);

// ─── Bottom Data Bar ───────────────────────────────────────────────────────

export const BottomBar: React.FC<{ progress: number; opacity: number }> = ({
  progress,
  opacity,
}) => (
  <div
    style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity }}
  >
    {/* thin progress fill */}
    <div
      style={{
        height: 1,
        width: `${progress * 100}%`,
        background: `linear-gradient(90deg, transparent, ${COLORS.yellow}70)`,
      }}
    />
    {/* baseline track */}
    <div
      style={{
        height: 1,
        width: "100%",
        backgroundColor: COLORS.white,
        opacity: 0.06,
        marginTop: -1,
      }}
    />
  </div>
);

// ─── Thin Horizontal Rule ──────────────────────────────────────────────────

export const HRule: React.FC<{
  y: number;
  opacity: number;
  widthPct?: number;
}> = ({ y, opacity, widthPct = 100 }) => (
  <div
    style={{
      position: "absolute",
      top: y,
      left: `${(100 - widthPct) / 2}%`,
      width: `${widthPct}%`,
      height: 1,
      backgroundColor: COLORS.white,
      opacity,
    }}
  />
);

// ─── Yellow Glow Text Shadow ───────────────────────────────────────────────

export function yellowGlow(intensity: number): string {
  return `0 0 ${16 + 28 * intensity}px rgba(255,248,0,${
    0.35 + 0.55 * intensity
  }), 0 0 ${48 * intensity}px rgba(255,248,0,${0.18 * intensity})`;
}
