/**
 * Scene 4 – World Building
 * Duration: 180 frames @ 30 fps (6 s)
 *
 * Three atmospheric sub-scenes (60 frames each):
 *   Gothic Horror  f 0–60   : pointed arch geometry, deep shadow lines
 *   Sci-Fi         f60–120  : hexagonal grid, circuit paths
 *   Urban Thriller f120–180 : building grid, surveillance interface
 *
 * Hard smash cuts at f60 and f120 (2-frame white flash each).
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

// ─── Gothic Horror ────────────────────────────────────────────────────────────

const GothicHorror: React.FC<{ progress: number; opacity: number }> = ({
  progress,
  opacity,
}) => {
  const cx = 960;
  const cy = 480;

  // Pointed arch: two arcs meeting at a point above centre
  const archH = 380;
  const archW = 280;
  const archPts = (side: -1 | 1) => {
    const cx2 = cx + side * (archW / 2);
    const baseY = cy + archH / 2;
    const tipX = cx;
    const tipY = cy - archH / 2;
    // bezier control points
    return `M ${cx2} ${baseY} Q ${cx2} ${tipY + 80} ${tipX} ${tipY}`;
  };

  // Rose window – spokes
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const r = 100;
    return {
      x1: cx + Math.cos(angle) * 18,
      y1: cy - archH / 2 + 100 + Math.sin(angle) * 18,
      x2: cx + Math.cos(angle) * r,
      y2: cy - archH / 2 + 100 + Math.sin(angle) * r,
    };
  });

  const dashLen = interpolate(progress, [0, 1], [0, 1000]);
  const fade = interpolate(progress, [0, 0.15], [0, 1]);

  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, opacity: opacity * fade }}
    >
      {/* vertical cathedral pillars */}
      {[-2, -1, 0, 1, 2].map((i) => (
        <line
          key={i}
          x1={cx + i * 140}
          y1={cy - 500}
          x2={cx + i * 140}
          y2={cy + 500}
          stroke={COLORS.white}
          strokeWidth={0.7}
          strokeOpacity={0.12}
        />
      ))}
      {/* arches */}
      <path
        d={archPts(-1)}
        stroke={COLORS.white}
        strokeWidth={1.2}
        strokeOpacity={0.35}
        fill="none"
        strokeDasharray={`${dashLen} 9999`}
      />
      <path
        d={archPts(1)}
        stroke={COLORS.white}
        strokeWidth={1.2}
        strokeOpacity={0.35}
        fill="none"
        strokeDasharray={`${dashLen} 9999`}
      />
      {/* rose window circle */}
      <circle
        cx={cx}
        cy={cy - archH / 2 + 100}
        r={100}
        fill="none"
        stroke={COLORS.yellow}
        strokeWidth={0.8}
        strokeOpacity={0.3}
        strokeDasharray={`${dashLen} 9999`}
      />
      {spokes.map((s, i) => (
        <line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={COLORS.yellow}
          strokeWidth={0.6}
          strokeOpacity={0.25}
        />
      ))}
      {/* floor lines converging */}
      {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={cx + i * 240}
          y1={cy + 500}
          x2={cx}
          y2={cy + 200}
          stroke={COLORS.white}
          strokeWidth={0.5}
          strokeOpacity={0.08}
        />
      ))}
    </svg>
  );
};

// ─── Sci-Fi ───────────────────────────────────────────────────────────────────

const hexPoly = (cx: number, cy: number, r: number) => {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
};

const SciFi: React.FC<{ progress: number; opacity: number }> = ({
  progress,
  opacity,
}) => {
  const r = 55;
  const cols = 22;
  const rows = 12;
  const hexes: { cx: number; cy: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * r * 1.73 + (row % 2 === 0 ? 0 : r * 0.865) - 60;
      const y = row * r * 1.5 - 40;
      hexes.push({ cx: x, cy: y });
    }
  }

  const scanY = interpolate(progress, [0.1, 0.9], [-60, 1140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {hexes.map((h, i) => {
        const distFromScan = Math.abs(h.cy - scanY);
        const lit = Math.max(0, 1 - distFromScan / 120);
        return (
          <polygon
            key={i}
            points={hexPoly(h.cx, h.cy, r - 2)}
            fill="none"
            stroke={lit > 0.1 ? COLORS.yellow : COLORS.white}
            strokeWidth={0.6}
            strokeOpacity={0.06 + lit * 0.22}
          />
        );
      })}

      {/* circuit-like horizontal paths */}
      {[200, 400, 540, 680, 820].map((y, i) => (
        <g key={i}>
          <line
            x1={60}
            y1={y}
            x2={1860}
            y2={y}
            stroke={COLORS.yellow}
            strokeWidth={0.5}
            strokeOpacity={0.08}
            strokeDasharray="2 18"
          />
        </g>
      ))}

      {/* target reticle */}
      <circle
        cx={960}
        cy={540}
        r={80}
        fill="none"
        stroke={COLORS.yellow}
        strokeWidth={0.8}
        strokeOpacity={0.35 * progress}
      />
      <circle
        cx={960}
        cy={540}
        r={14}
        fill="none"
        stroke={COLORS.yellow}
        strokeWidth={1.2}
        strokeOpacity={0.6 * progress}
      />
      <line
        x1={820}
        y1={540}
        x2={880}
        y2={540}
        stroke={COLORS.yellow}
        strokeWidth={0.8}
        strokeOpacity={0.5 * progress}
      />
      <line
        x1={1040}
        y1={540}
        x2={1100}
        y2={540}
        stroke={COLORS.yellow}
        strokeWidth={0.8}
        strokeOpacity={0.5 * progress}
      />
      <line
        x1={960}
        y1={400}
        x2={960}
        y2={460}
        stroke={COLORS.yellow}
        strokeWidth={0.8}
        strokeOpacity={0.5 * progress}
      />
      <line
        x1={960}
        y1={620}
        x2={960}
        y2={680}
        stroke={COLORS.yellow}
        strokeWidth={0.8}
        strokeOpacity={0.5 * progress}
      />
    </svg>
  );
};

// ─── Urban Thriller ───────────────────────────────────────────────────────────

const UrbanThriller: React.FC<{ progress: number; opacity: number }> = ({
  progress,
  opacity,
}) => {
  // Building silhouettes as simple rectangles
  const buildings = [
    { x: 50,   w: 90,  h: 560, y: 520 },
    { x: 155,  w: 60,  h: 380, y: 700 },
    { x: 230,  w: 110, h: 620, y: 460 },
    { x: 355,  w: 80,  h: 440, y: 640 },
    { x: 450,  w: 140, h: 700, y: 380 },
    { x: 600,  w: 70,  h: 500, y: 580 },
    { x: 680,  w: 130, h: 580, y: 500 },
    { x: 1110, w: 130, h: 580, y: 500 },
    { x: 1250, w: 70,  h: 500, y: 580 },
    { x: 1330, w: 140, h: 700, y: 380 },
    { x: 1490, w: 80,  h: 440, y: 640 },
    { x: 1580, w: 110, h: 620, y: 460 },
    { x: 1705, w: 60,  h: 380, y: 700 },
    { x: 1780, w: 90,  h: 560, y: 520 },
  ];

  // Window lights
  const windowRows = 14;
  const windowCols = 5;

  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {buildings.map((b, i) => (
        <g key={i}>
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill="none"
            stroke={COLORS.white}
            strokeWidth={0.8}
            strokeOpacity={0.15}
          />
          {/* window grid */}
          {Array.from({ length: windowRows }, (_, wr) =>
            Array.from({ length: windowCols }, (_, wc) => {
              const wx = b.x + 8 + wc * ((b.w - 16) / windowCols);
              const wy = b.y + 16 + wr * 36;
              if (wy > b.y + b.h - 20) return null;
              // deterministic "lit" windows
              const lit = (i * 7 + wr * 3 + wc * 11) % 5 !== 0;
              return (
                <rect
                  key={`${wr}-${wc}`}
                  x={wx}
                  y={wy}
                  width={(b.w - 16) / windowCols - 3}
                  height={22}
                  fill={lit ? COLORS.yellow : "transparent"}
                  fillOpacity={lit ? 0.06 + 0.04 * progress : 0}
                  stroke={COLORS.white}
                  strokeWidth={0.3}
                  strokeOpacity={0.08}
                />
              );
            })
          )}
        </g>
      ))}

      {/* ground line */}
      <line
        x1={0}
        y1={1080}
        x2={1920}
        y2={1080}
        stroke={COLORS.white}
        strokeWidth={1}
        strokeOpacity={0.15}
      />

      {/* surveillance overlay */}
      <rect
        x={760}
        y={380}
        width={400}
        height={320}
        fill="none"
        stroke={COLORS.yellow}
        strokeWidth={0.8}
        strokeOpacity={0.25 * progress}
      />
      {/* corner tick marks */}
      {[
        [760, 380], [1160, 380], [760, 700], [1160, 700],
      ].map(([cx, cy], i) => {
        const dx = i % 2 === 0 ? 1 : -1;
        const dy = i < 2 ? 1 : -1;
        return (
          <g key={i}>
            <line
              x1={cx}
              y1={cy}
              x2={cx + dx * 20}
              y2={cy}
              stroke={COLORS.yellow}
              strokeWidth={1.2}
              strokeOpacity={0.6 * progress}
            />
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy + dy * 20}
              stroke={COLORS.yellow}
              strokeWidth={1.2}
              strokeOpacity={0.6 * progress}
            />
          </g>
        );
      })}
    </svg>
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────

const ATMOSPHERE_LABELS = [
  { key: "gothic",  label: "Gothic Horror",   index: "A" },
  { key: "scifi",   label: "Sci-Fi",          index: "B" },
  { key: "urban",   label: "Urban Thriller",  index: "C" },
];

export const Scene4World: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sub-scene: 0 = gothic (f0–60), 1 = scifi (f60–120), 2 = urban (f120–180)
  const subScene = frame < 60 ? 0 : frame < 120 ? 1 : 2;
  const subFrame = subScene === 0 ? frame : subScene === 1 ? frame - 60 : frame - 120;
  const subProgress = subFrame / 60;

  // ── Smash-cut flashes at f60 and f120 ────────────────────────────────────
  const flash1 = interpolate(frame, [58, 60, 62, 65], [0, 0.7, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash2 = interpolate(frame, [118, 120, 122, 125], [0, 0.7, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Per sub-scene atmosphere text ────────────────────────────────────────
  const textSpring = spring({
    frame: subFrame - 8,
    fps,
    config: { damping: 82, stiffness: 200 },
  });
  const textY = interpolate(textSpring, [0, 1], [44, 0]);
  const textOpacity = interpolate(textSpring, [0, 0.2, 0.85, 1], [0, 1, 1, 0.6]);
  const textFade = interpolate(subFrame, [48, 58], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Scene fade-out ────────────────────────────────────────────────────────
  const sceneOpacity = interpolate(frame, [168, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barProgress = interpolate(frame, [0, 180], [0, 1]);
  const chromeOpacity = interpolate(frame, [3, 18], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const atm = ATMOSPHERE_LABELS[subScene];

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bg, opacity: sceneOpacity }}
    >
      <GridLines opacity={0.02} />
      <UICorners opacity={chromeOpacity} />
      <SceneLabel label="World" index="04" opacity={chromeOpacity * 1.2} />
      <BottomBar
        progress={barProgress}
        opacity={interpolate(frame, [3, 18], [0, 0.6], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />

      {/* ── Geometry layers ─────────────────────────────────────────── */}
      <GothicHorror
        progress={subScene === 0 ? subProgress : 0}
        opacity={subScene === 0 ? 1 : 0}
      />
      <SciFi
        progress={subScene === 1 ? subProgress : 0}
        opacity={subScene === 1 ? 1 : 0}
      />
      <UrbanThriller
        progress={subScene === 2 ? subProgress : 0}
        opacity={subScene === 2 ? 1 : 0}
      />

      {/* ── Cut flashes ─────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.white,
          opacity: Math.max(flash1, flash2),
          pointerEvents: "none",
        }}
      />

      {/* ── Atmosphere label ────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 140,
        }}
      >
        <div
          style={{
            opacity: textOpacity * textFade,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.3em",
              color: COLORS.yellow,
              textTransform: "uppercase",
              marginBottom: 10,
              opacity: 0.8,
            }}
          >
            {atm.index} — WORLD
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: COLORS.white,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {atm.label}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
