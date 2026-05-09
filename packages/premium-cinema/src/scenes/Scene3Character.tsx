/**
 * Scene 3 – Character Direction
 * Duration: 180 frames @ 30 fps (6 s)
 *
 * Timeline:
 *   f 0–35   : abstract facial wireframe draws in (SVG stroke animation)
 *   f25–50   : tracking dots appear
 *   f50–85   : "every angle" enters with perspective tilt
 *   f85–95   : hard cut flash
 *   f90–125  : camera "shift" + "every angle" re-enters from different axis
 *   f125–155 : "every lighting condition" enters
 *   f155–175 : both concepts fade, wireframe fades
 *   f165–180 : scene out
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

// ─── Wireframe geometry (relative to face centre 960, 480) ──────────────────

type Point = { x: number; y: number };

const C = { x: 960, y: 470 };
const S = 230; // scale

const pts: Point[] = [
  // head silhouette
  { x: 0,      y: -1.0  }, // 0  top-crown
  { x: -0.45,  y: -0.75 }, // 1  upper-left
  { x:  0.45,  y: -0.75 }, // 2  upper-right
  { x: -0.62,  y: -0.2  }, // 3  left-temple
  { x:  0.62,  y: -0.2  }, // 4  right-temple
  // eye region
  { x: -0.38,  y:  0.05 }, // 5  left-eye
  { x:  0.38,  y:  0.05 }, // 6  right-eye
  { x: -0.15,  y:  0.08 }, // 7  inner-left-eye
  { x:  0.15,  y:  0.08 }, // 8  inner-right-eye
  // nose
  { x:  0,     y:  0.18 }, // 9  nose-bridge
  { x: -0.12,  y:  0.42 }, // 10 nose-left
  { x:  0.12,  y:  0.42 }, // 11 nose-right
  { x:  0,     y:  0.48 }, // 12 nose-tip
  // mouth / jaw
  { x: -0.25,  y:  0.58 }, // 13 mouth-left
  { x:  0,     y:  0.56 }, // 14 mouth-centre
  { x:  0.25,  y:  0.58 }, // 15 mouth-right
  { x: -0.35,  y:  0.75 }, // 16 jaw-left
  { x:  0,     y:  0.82 }, // 17 chin
  { x:  0.35,  y:  0.75 }, // 18 jaw-right
  // cheeks
  { x: -0.55,  y:  0.3  }, // 19 left-cheek
  { x:  0.55,  y:  0.3  }, // 20 right-cheek
];

const toSVG = (p: Point) => ({
  x: C.x + p.x * S,
  y: C.y + p.y * S,
});

// Edges: pairs of point indices
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4],
  [3, 5], [4, 6], [1, 5], [2, 6],
  [5, 7], [6, 8], [7, 9], [8, 9],
  [5, 9], [6, 9], [9, 10], [9, 11],
  [10, 12], [11, 12], [10, 13], [11, 15],
  [12, 14], [13, 14], [14, 15],
  [13, 16], [15, 18], [16, 17], [17, 18],
  [3, 19], [4, 20], [19, 13], [20, 15],
  [5, 19], [6, 20], [7, 8],
  [0, 3], [0, 4],
];

// Tracking dot positions (index into pts)
const TRACKING_DOTS = [0, 1, 2, 5, 6, 9, 12, 13, 15, 17, 19, 20];

// ─── SVG Wireframe ────────────────────────────────────────────────────────────

const FaceWireframe: React.FC<{ drawProgress: number; dotsOpacity: number }> = ({
  drawProgress,
  dotsOpacity,
}) => {
  const totalEdges = EDGES.length;

  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* edges */}
      {EDGES.map(([ai, bi], edgeIdx) => {
        const a = toSVG(pts[ai]);
        const b = toSVG(pts[bi]);
        // stagger: edge i draws from drawProgress=i/N to (i+1)/N
        // so the last edge always completes exactly when drawProgress hits 1.0
        const edgeStart = edgeIdx / totalEdges;
        const edgeEnd = (edgeIdx + 1) / totalEdges;
        const edgeProgress = interpolate(
          drawProgress,
          [edgeStart, edgeEnd],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <line
            key={edgeIdx}
            x1={a.x}
            y1={a.y}
            x2={a.x + (b.x - a.x) * edgeProgress}
            y2={a.y + (b.y - a.y) * edgeProgress}
            stroke={COLORS.white}
            strokeWidth={0.8}
            strokeOpacity={0.28}
          />
        );
      })}

      {/* tracking dots */}
      {TRACKING_DOTS.map((pi, di) => {
        const p = toSVG(pts[pi]);
        const dotDelay = di / TRACKING_DOTS.length;
        const dotOpacity =
          dotsOpacity *
          interpolate(
            drawProgress,
            [0.6 + dotDelay * 0.3, 0.6 + dotDelay * 0.3 + 0.08],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
        return (
          <g key={di}>
            <circle
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill={COLORS.yellow}
              opacity={dotOpacity * 0.9}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={7}
              fill="none"
              stroke={COLORS.yellow}
              strokeWidth={0.7}
              opacity={dotOpacity * 0.4}
            />
          </g>
        );
      })}

      {/* bounding box UI lines */}
      <rect
        x={C.x - S * 0.75}
        y={C.y - S * 1.1}
        width={S * 1.5}
        height={S * 2.0}
        fill="none"
        stroke={COLORS.yellow}
        strokeWidth={0.6}
        strokeOpacity={dotsOpacity * 0.22}
        strokeDasharray="6 10"
      />
    </svg>
  );
};

// ─── Perspective text ─────────────────────────────────────────────────────────

const PerspText: React.FC<{
  text: string;
  opacity: number;
  rotX: number;
  rotY: number;
  translateY: number;
  fontSize?: number;
  color?: string;
  glowIntensity?: number;
}> = ({
  text,
  opacity,
  rotX,
  rotY,
  translateY,
  fontSize = 88,
  color = COLORS.white,
  glowIntensity = 0,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize,
      fontWeight: 900,
      letterSpacing: "-0.03em",
      color,
      opacity,
      transform: `perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${translateY}px)`,
      textShadow: glowIntensity > 0 ? yellowGlow(glowIntensity) : "none",
      textAlign: "center",
      textTransform: "uppercase",
      lineHeight: 1,
      userSelect: "none",
    }}
  >
    {text}
  </div>
);

// ─── Scene ────────────────────────────────────────────────────────────────────

export const Scene3Character: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Wireframe draw-in ─────────────────────────────────────────────────────
  const drawProgress = interpolate(frame, [0, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotsOpacity = interpolate(frame, [25, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wireFade = interpolate(frame, [155, 175], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── "every angle" – first take (f50–90) ──────────────────────────────────
  const angle1Spring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 78, stiffness: 200 },
  });
  const angle1Opacity = interpolate(frame, [50, 65, 86, 96], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const angle1Y = interpolate(angle1Spring, [0, 1], [50, 0]);
  const angle1RotX = interpolate(angle1Spring, [0, 1], [22, 0]);
  const angle1RotY = interpolate(angle1Spring, [0, 1], [-18, 0]);

  // ── hard-cut flash f88–92 ─────────────────────────────────────────────────
  const flashOpacity = interpolate(frame, [88, 90, 92, 95], [0, 0.55, 0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── "every angle" – second take (f95–125), different axis ────────────────
  const angle2Spring = spring({
    frame: frame - 95,
    fps,
    config: { damping: 72, stiffness: 220 },
  });
  const angle2Opacity = interpolate(frame, [95, 108, 126, 132], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const angle2Y = interpolate(angle2Spring, [0, 1], [40, 0]);
  const angle2RotY = interpolate(angle2Spring, [0, 1], [28, 0]);

  // ── "every lighting condition" (f128–165) ────────────────────────────────
  const lightSpring = spring({
    frame: frame - 128,
    fps,
    config: { damping: 82, stiffness: 180 },
  });
  const lightOpacity = interpolate(frame, [128, 142, 162, 172], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lightY = interpolate(lightSpring, [0, 1], [44, 0]);
  const lightGlow = interpolate(frame, [148, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Scene fade-out ────────────────────────────────────────────────────────
  const sceneOpacity = interpolate(frame, [165, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barProgress = interpolate(frame, [0, 180], [0, 1]);
  const chromeOpacity = interpolate(frame, [5, 25], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bg, opacity: sceneOpacity }}
    >
      <GridLines opacity={0.025} />
      <UICorners opacity={chromeOpacity} />
      <SceneLabel label="Character" index="03" opacity={chromeOpacity * 1.2} />
      <BottomBar
        progress={barProgress}
        opacity={interpolate(frame, [5, 22], [0, 0.6], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />

      {/* ── Wireframe face ───────────────────────────────────────────── */}
      <div style={{ opacity: wireFade }}>
        <FaceWireframe drawProgress={drawProgress} dotsOpacity={dotsOpacity} />
      </div>

      {/* ── Cut flash ────────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.white,
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* ── Text layer ───────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 180,
          gap: 0,
        }}
      >
        {/* "every angle" first */}
        <div
          style={{
            position: "absolute",
            bottom: 180,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: angle1Opacity,
          }}
        >
          <PerspText
            text="every angle"
            opacity={1}
            rotX={angle1RotX}
            rotY={angle1RotY}
            translateY={angle1Y}
            fontSize={96}
          />
        </div>

        {/* "every angle" second take */}
        <div
          style={{
            position: "absolute",
            bottom: 180,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: angle2Opacity,
          }}
        >
          <PerspText
            text="every angle"
            opacity={1}
            rotX={0}
            rotY={angle2RotY}
            translateY={angle2Y}
            fontSize={96}
          />
        </div>

        {/* "every lighting condition" */}
        <div
          style={{
            position: "absolute",
            bottom: 140,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: lightOpacity,
          }}
        >
          <PerspText
            text="every lighting condition"
            opacity={1}
            rotX={0}
            rotY={0}
            translateY={lightY}
            fontSize={80}
            color={COLORS.yellow}
            glowIntensity={lightGlow}
          />
        </div>
      </AbsoluteFill>

      {/* ── Small UI readout top-right ───────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 110,
          opacity: dotsOpacity * 0.4,
          fontFamily: FONT,
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: "0.18em",
          color: COLORS.yellow,
          textTransform: "uppercase",
          lineHeight: 2,
          textAlign: "right",
        }}
      >
        <div>FACIAL MESH ACTIVE</div>
        <div style={{ opacity: 0.6 }}>TRACKING 12 PTS</div>
        <div style={{ opacity: 0.6 }}>DEPTH MAP: 96%</div>
      </div>
    </AbsoluteFill>
  );
};
