/**
 * IDALL – Premium Cinema Motion Graphics
 *
 * 30 fps · 1920×1080 · 30 seconds (900 frames)
 *
 * Scene map:
 *   Scene 1  f   0–165  Black Void Introduction
 *   Scene 2  f 165–330  "Not a collection of tools." → SYSTEM
 *   Scene 3  f 330–510  Character Direction
 *   Scene 4  f 510–690  World Building
 *   Scene 5  f 690–930  Storytelling
 */

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS } from "./constants";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2System } from "./scenes/Scene2System";
import { Scene3Character } from "./scenes/Scene3Character";
import { Scene4World } from "./scenes/Scene4World";
import { Scene5Story } from "./scenes/Scene5Story";

export const FPS = 30;

// Scene durations (frames)
const D1 = 165; // 5.5 s
const D2 = 165; // 5.5 s
const D3 = 180; // 6.0 s
const D4 = 180; // 6.0 s
const D5 = 240; // 8.0 s  (Scene5 internal length is 240)

export const TOTAL_FRAMES = D1 + D2 + D3 + D4 + D5; // 930 frames = 31 s

export const PremiumCinema: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <Sequence from={0} durationInFrames={D1}>
      <Scene1Intro />
    </Sequence>
    <Sequence from={D1} durationInFrames={D2}>
      <Scene2System />
    </Sequence>
    <Sequence from={D1 + D2} durationInFrames={D3}>
      <Scene3Character />
    </Sequence>
    <Sequence from={D1 + D2 + D3} durationInFrames={D4}>
      <Scene4World />
    </Sequence>
    <Sequence from={D1 + D2 + D3 + D4} durationInFrames={D5}>
      <Scene5Story />
    </Sequence>
  </AbsoluteFill>
);
