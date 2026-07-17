import { Composition } from "remotion";
import {
  CareerFlowDemo,
  CareerFlowPreview,
  DEMO_DURATION_IN_FRAMES,
  PREVIEW_DURATION_IN_FRAMES,
} from "./CareerFlowDemo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="CareerFlowV1Demo"
        component={CareerFlowDemo}
        durationInFrames={DEMO_DURATION_IN_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CareerFlowPreview"
        component={CareerFlowPreview}
        durationInFrames={PREVIEW_DURATION_IN_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
