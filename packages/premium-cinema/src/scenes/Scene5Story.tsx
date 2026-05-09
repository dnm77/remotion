/**
 * Scene 5 – Storytelling
 * Duration: 240 frames @ 30 fps (8 s)
 *
 * Fast editorial rhythm – each card hits hard and flashes out:
 *
 *   f 0–48   : "Editing rhythm"           (white, massive)
 *   f48–52   : hard cut flash
 *   f50–98   : "Camera movement"          (white, slides from right)
 *   f98–102  : cut flash
 *   f100–148 : "Build tension"            (white, tight spacing)
 *   f148–152 : cut flash
 *   f150–210 : "The viewer"               (slower entrance)
 *   f175–240 : "can't look away"          (yellow glow, lingers)
 *   f220–240 : everything fades
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "../constants";
import {
  BottomBar,
  GridLines,
  SceneLabel,
  UICorners,
  yellowGlow,
} from "../components/UIElements";

// ─── Reusable "cut flash" ─────────────────────────────────────────────────────

const CutFlash: React.FC<{ at: number; frame: number }> = ({ at, frame }) => {
  const opacity = interpolate(
    frame,
    [at - 1, at, at + 2, at + 5],
    [0, 0.75, 0.75, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.white,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// ─── Full-screen typography card ──────────────────────────────────────────────

const Card: React.FC<{
  text: string;
  opacity?: number;
  translateX?: number;
  translateY?: number;
  fontSize?: number;
  color?: string;
  glowIntensity?: number;
  letterSpacing?: string;
}> = ({
  text,
  opacity = 1,
  translateX = 0,
  translateY = 0,
  fontSize = 152,
  color = COLORS.white,
  glowIntensity = 0,
  letterSpacing = "-0.04em",
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize,
      fontWeight: 900,
      letterSpacing,
      color,
      opacity,
      transform: `translateX(${translateX}px) translateY(${translateY}px)`,
      textShadow: glowIntensity > 0 ? yellowGlow(glowIntensity) : "none",
      textAlign: "center",
      textTransform: "uppercase",
      lineHeight: 1,
      userSelect: "none",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

// ─── Kinetic background stripes (editorial energy) ────────────────────────────

const EditStripes: React.FC<{ frame: number }> = ({ frame }) => {
  // rapid horizontal stripe flicker synced to edit points
  const beats = [48, 98, 148];
  const stripOpacity = beats.reduce((acc, b) => {
    const pulse = interpolate(frame, [b, b + 2, b + 6, b + 12], [0, 0.06, 0.06, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return Math.max(acc, pulse);
  }, 0);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: stripOpacity,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 6px,
          ${COLORS.white} 6px,
          ${COLORS.white} 7px
        )`,
        pointerEvents: "none",
      }}
    />
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────

export const Scene5Story: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Card 1: "Editing rhythm" (f0–50) ─────────────────────────────────────
  const card1Spring = spring({
    frame: frame - 0,
    fps,
    config: { damping: 85, stiffness: 220 },
  });
  const card1Opacity = interpolate(
    frame,
    [0, 8, 44, 50],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const card1Y = interpolate(card1Spring, [0, 1], [80, 0]);

  // ── Card 2: "Camera movement" (f50–100) – slides from right ──────────────
  const card2Spring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 80, stiffness: 240 },
  });
  const card2Opacity = interpolate(
    frame,
    [50, 58, 94, 100],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const card2X = interpolate(card2Spring, [0, 1], [300, 0]);

  // ── Card 3: "Build tension" (f100–150) – tight letter-spacing entrance ───
  const card3Spring = spring({
    frame: frame - 100,
    fps,
    config: { damping: 75, stiffness: 260 },
  });
  const card3Opacity = interpolate(
    frame,
    [100, 108, 144, 150],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const card3Scale = interpolate(card3Spring, [0, 1], [1.18, 1]);

  // ── Card 4a: "The viewer" (f150–240) ─────────────────────────────────────
  const card4Spring = spring({
    frame: frame - 150,
    fps,
    config: { damping: 90, stiffness: 130, mass: 1.2 },
  });
  const card4Opacity = interpolate(frame, [150, 166, 235, 240], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card4Y = interpolate(card4Spring, [0, 1], [60, 0]);

  // ── Card 4b: "can't look away" (f176–240) ────────────────────────────────
  const card5Spring = spring({
    frame: frame - 176,
    fps,
    config: { damping: 92, stiffness: 140, mass: 1.1 },
  });
  const card5Opacity = interpolate(frame, [176, 190, 235, 240], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card5Y = interpolate(card5Spring, [0, 1], [50, 0]);
  const card5Glow = interpolate(frame, [196, 225], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Scene fade-out ────────────────────────────────────────────────────────
  const sceneOpacity = interpolate(frame, [232, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barProgress = interpolate(frame, [0, 240], [0, 1]);
  const chromeOpacity = interpolate(frame, [3, 22], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bg, opacity: sceneOpacity }}
    >
      <GridLines opacity={0.02} />
      <UICorners opacity={chromeOpacity} />
      <SceneLabel
        label="Storytelling"
        index="05"
        opacity={chromeOpacity * 1.2}
      />
      <BottomBar
        progress={barProgress}
        opacity={interpolate(frame, [3, 20], [0, 0.6], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />

      {/* editorial stripe energy */}
      <EditStripes frame={frame} />

      {/* ── Cards 1–3: full-screen single word/phrase ─────────────── */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            position: "absolute",
            opacity: card1Opacity,
            transform: `translateY(${card1Y}px)`,
          }}
        >
          <Card text="Editing rhythm" fontSize={148} />
        </div>

        {/* Card 2 */}
        <div
          style={{
            position: "absolute",
            opacity: card2Opacity,
            transform: `translateX(${card2X}px)`,
          }}
        >
          <Card text="Camera movement" fontSize={118} />
        </div>

        {/* Card 3 */}
        <div
          style={{
            position: "absolute",
            opacity: card3Opacity,
            transform: `scale(${card3Scale})`,
          }}
        >
          <Card
            text="Build tension"
            fontSize={148}
            letterSpacing="0.06em"
          />
        </div>

        {/* Cards 4a + 4b stacked */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              opacity: card4Opacity,
              transform: `translateY(${card4Y}px)`,
            }}
          >
            <Card
              text="The viewer"
              fontSize={130}
              color={COLORS.white}
            />
          </div>
          <div
            style={{
              opacity: card5Opacity,
              transform: `translateY(${card5Y}px)`,
            }}
          >
            <Card
              text="can't look away."
              fontSize={130}
              color={COLORS.yellow}
              glowIntensity={card5Glow}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* cut flashes */}
      <CutFlash at={48} frame={frame} />
      <CutFlash at={98} frame={frame} />
      <CutFlash at={148} frame={frame} />

      {/* ── IDALL closing mark ──────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 64,
          right: 110,
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.28em",
          color: COLORS.white,
          opacity:
            interpolate(frame, [196, 216], [0, 0.5], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) *
            interpolate(frame, [232, 240], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          textTransform: "uppercase",
        }}
      >
        IDALL · 2025
      </div>
    </AbsoluteFill>
  );
};
