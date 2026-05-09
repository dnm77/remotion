/**
 * Scene 1 – Black Void Introduction
 * Duration: 165 frames @ 30 fps (5.5 s)
 *
 * Timeline:
 *   f 0–12   : pure void
 *   f12–28   : grid + corner brackets fade in, scan line sweeps
 *   f28–28   : scan line fires
 *   f30–80   : headline springs up ("In IDALL we build a cinema production system.")
 *   f65–105  : "system" transitions white → yellow with glow
 *   f105–148 : hold + subtle breathe
 *   f148–165 : scene fades to black
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT, lerpColor } from "../constants";
import {
  BottomBar,
  GridLines,
  ScanLine,
  SceneLabel,
  UICorners,
  yellowGlow,
} from "../components/UIElements";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scan line sweeps top → 65% height in f12–42 ──────────────────────────
  const scanOpacity = interpolate(frame, [12, 22, 38, 50], [0, 0.9, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanY = interpolate(frame, [12, 50], [0, 700], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── UI chrome ──────────────────────────────────────────────────────────────
  const chromeOpacity = interpolate(frame, [15, 38], [0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacity = interpolate(frame, [22, 44], [0, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Headline spring entrance ───────────────────────────────────────────────
  const textSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 88, stiffness: 185, mass: 0.85 },
  });
  const textY = interpolate(textSpring, [0, 1], [64, 0]);
  const textOpacity = interpolate(textSpring, [0, 0.15, 1], [0, 0.7, 1]);

  // ── "system" highlight: white → yellow over f65–105 ───────────────────────
  const systemT = interpolate(frame, [65, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const systemColor = lerpColor(systemT);
  const systemGlowIntensity = interpolate(frame, [90, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Sub-label "system." below headline ────────────────────────────────────
  const subLabelOpacity = interpolate(frame, [80, 105], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Thin separator rule fades in ──────────────────────────────────────────
  const ruleOpacity = interpolate(frame, [55, 80], [0, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Scene fade-out ────────────────────────────────────────────────────────
  const sceneOpacity = interpolate(frame, [148, 165], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Bottom bar progress ───────────────────────────────────────────────────
  const barProgress = interpolate(frame, [0, 165], [0, 1]);

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bg, opacity: sceneOpacity }}
    >
      <GridLines opacity={0.032} />

      <ScanLine y={scanY} opacity={scanOpacity} />

      <UICorners opacity={chromeOpacity} />

      <SceneLabel label="Introduction" index="01" opacity={labelOpacity} />

      <BottomBar
        progress={barProgress}
        opacity={interpolate(frame, [20, 40], [0, 0.6], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />

      {/* ── Separator rule ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          left: "50%",
          transform: "translateX(-50%)",
          width: 640,
          height: 1,
          backgroundColor: COLORS.white,
          opacity: ruleOpacity,
        }}
      />

      {/* ── Main headline ─────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 220px",
        }}
      >
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 76,
              fontWeight: 800,
              color: COLORS.white,
              letterSpacing: "-0.03em",
              lineHeight: 1.18,
              textAlign: "center",
            }}
          >
            In IDALL we build a<br />
            cinema production{" "}
            <span
              style={{
                color: systemColor,
                textShadow:
                  systemGlowIntensity > 0 ? yellowGlow(systemGlowIntensity) : "none",
                display: "inline",
              }}
            >
              system
            </span>
            .
          </div>
        </div>

        {/* ── Sub descriptor ──────────────────────────────────────────── */}
        <div
          style={{
            marginTop: 40,
            opacity: subLabelOpacity,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: COLORS.yellow,
            }}
          />
          <span
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: COLORS.white,
              textTransform: "uppercase",
            }}
          >
            AI Cinema Operating System
          </span>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: COLORS.yellow,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* ── IDALL wordmark – top right ──────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 52,
          right: 96,
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.28em",
          color: COLORS.white,
          opacity: labelOpacity * 0.6,
          textTransform: "uppercase",
        }}
      >
        IDALL
      </div>
    </AbsoluteFill>
  );
};
