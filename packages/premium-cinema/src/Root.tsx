import { Composition } from "remotion";
import { PremiumCinema, TOTAL_FRAMES, FPS } from "./PremiumCinema";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="PremiumCinema"
    component={PremiumCinema}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{}}
  />
);
