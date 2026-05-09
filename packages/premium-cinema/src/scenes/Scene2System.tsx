/**
 * Scene 2 – "Not a collection of tools." → SYSTEM
 * Duration: 165 frames @ 30 fps (5.5 s)
 *
 * Timeline:
 *   f 0–10   : void
 *   f10–50   : "Not a collection of" enters (slide + fade)
 *   f50–70   : "TOOLS." enters large below
 *   f72–100  : TOOLS letters fragment outward (spring explode, opacity→0)
 *   f100–130 : SYSTEM letters assemble from scatter (staggered spring)
 *   f130–155 : SYSTEM holds, glow builds
 *   f155–165 : fade out
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

// ─── Fragment displacement seeds for TOOLS. ──────────────────────────────────
const TOOLS_SCATTER = [
  { x: -420, y: -260, r: -58 },
  { x: -180, y: 310, r: 32 },
  { x: 60,   y: -340, r: -44 },
  { x: 380,  y: 220,  r: 72 },
  { x: -310, y: -190, r: -22 },
  { x: 460,  y: 290,  r: 50 },
];

// ─── Assembly origins for SYSTEM ─────────────────────────────────────────────
const SYSTEM_ORIGINS = [
  { x: -560, y: -300, r:  50 },
  { x:  420, y: -380, r: -38 },
  { x: -260, y:  360, r:  62 },
  { x:  620, y:  240, r: -54 },
  { x: -500, y: -160, r:  28 },
  { x:  490, y:  340, r: -46 },
];

// ─── Letter components ────────────────────────────────────────────────────────

const ToolsLetter: React.FC<{
  char: string;
  index: number;
  fragmentProgress: number;
}> = ({ char, index, fragmentProgress }) => {
  const d = TOOLS_SCATTER[index] ?? { x: 0, y: 0, r: 0 };
  return (
    <span
      style={{
        display: "inline-block",
        transform: `translateX(${d.x * fragmentProgress}px) translateY(${
          d.y * fragmentProgress
        }px) rotate(${d.r * fragmentProgress}deg)`,
        opacity: 1 - fragmentProgress,
      }}
    >
      {char}
    </span>
  );
};

const SystemLetter: React.FC<{
  char: string;
  index: number;
  assembleProgress: number;
  glowIntensity: number;
}> = ({ char, index, assembleProgress, glowIntensity }) => {
  const d = SYSTEM_ORIGINS[index] ?? { x: 0, y: 0, r: 0 };
  const remaining = 1 - assembleProgress;
  return (
    <span
      style={{
        display: "inline-block",
        transform: `translateX(${d.x * remaining}px) translateY(${
          d.y * remaining
        }px) rotate(${d.r * remaining}deg) scale(${
          0.4 + 0.6 * assembleProgress
        })`,
        opacity: assembleProgress,
        color: COLORS.yellow,
        textShadow: yellowGlow(glowIntensity * assembleProgress),
      }}
    >
      {char}
    </span>
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────

export const Scene2System: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── "Not a collection of" entrance ───────────────────────────────────────
  const prefixSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 90, stiffness: 190 },
  });
  const prefixY = interpolate(prefixSpring, [0, 1], [40, 0]);
  const prefixOpacity = interpolate(prefixSpring, [0, 0.2, 1], [0, 0.5, 1]);

  // Hide prefix once SYSTEM is prominent
  const prefixFade = interpolate(frame, [112, 128], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── TOOLS entrance ────────────────────────────────────────────────────────
  const toolsEntrySpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 80, stiffness: 200 },
  });
  const toolsEntryY = interpolate(toolsEntrySpring, [0, 1], [50, 0]);
  const toolsEntryOpacity = interpolate(toolsEntrySpring, [0, 0.15, 1], [0, 0.6, 1]);

  // ── TOOLS fragment (f72–100) ──────────────────────────────────────────────
  const fragmentSpring = spring({
    frame: frame - 72,
    fps,
    config: { damping: 62, stiffness: 200, mass: 0.7 },
  });
  const fragmentProgress = interpolate(fragmentSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── SYSTEM assemble – staggered per letter (f100–130) ────────────────────
  const systemSprings = Array.from({ length: 6 }, (_, i) =>
    spring({
      frame: frame - (100 + i * 3),
      fps,
      config: { damping: 68, stiffness: 210, mass: 0.75 },
    })
  );

  // ── SYSTEM glow builds after assembly ────────────────────────────────────
  const glowIntensity = interpolate(frame, [130, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Scene fade-out ────────────────────────────────────────────────────────
  const sceneOpacity = interpolate(frame, [155, 165], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barProgress = interpolate(frame, [0, 165], [0, 1]);

  const chromeOpacity = interpolate(frame, [5, 25], [0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bg, opacity: sceneOpacity }}
    >
      <GridLines opacity={0.028} />
      <UICorners opacity={chromeOpacity} />
      <SceneLabel label="Identity" index="02" opacity={chromeOpacity * 1.1} />
      <BottomBar
        progress={barProgress}
        opacity={interpolate(frame, [8, 28], [0, 0.6], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />

      {/* ── Crosshair centre mark (appears when SYSTEM assembles) ─── */}
      {frame >= 95 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: interpolate(frame, [95, 110], [0, 0.18], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* horizontal */}
          <div
            style={{
              position: "absolute",
              width: 120,
              height: 1,
              backgroundColor: COLORS.yellow,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* vertical */}
          <div
            style={{
              position: "absolute",
              width: 1,
              height: 120,
              backgroundColor: COLORS.yellow,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* ── "Not a collection of" ─────────────────────────────────── */}
        <div
          style={{
            opacity: prefixOpacity * prefixFade,
            transform: `translateY(${prefixY}px)`,
            fontFamily: FONT,
            fontSize: 32,
            fontWeight: 400,
            letterSpacing: "0.04em",
            color: COLORS.white,
            textTransform: "uppercase",
          }}
        >
          Not a collection of
        </div>

        {/* ── TOOLS. / SYSTEM side-by-side layer ───────────────────── */}
        <div style={{ position: "relative", height: 200 }}>
          {/* TOOLS. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: toolsEntryOpacity,
              transform: `translateY(${toolsEntryY}px)`,
              fontFamily: FONT,
              fontSize: 160,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: COLORS.white,
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            {"TOOLS.".split("").map((ch, i) => (
              <ToolsLetter
                key={i}
                char={ch}
                index={i}
                fragmentProgress={fragmentProgress}
              />
            ))}
          </div>

          {/* SYSTEM */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT,
              fontSize: 160,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            {"SYSTEM".split("").map((ch, i) => (
              <SystemLetter
                key={i}
                char={ch}
                index={i}
                assembleProgress={systemSprings[i]}
                glowIntensity={glowIntensity}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
