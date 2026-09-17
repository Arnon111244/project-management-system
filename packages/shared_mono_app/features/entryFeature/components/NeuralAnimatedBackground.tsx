"use client";

import { View } from "ui/components/view";
import {
  isWeb,
  webBlurStyle,
} from "shared_mono_app/features/entryFeature/components/platformStyles";
import { NEURAL } from "ui/theme/neuralRuntime";

const ORB_BLUR = isWeb ? 80 : 0;

/**
 * Static Background for the Hero section.
 * Clean, stationary soft ambient glow with zero animations or moving lines.
 */
export function NeuralHeroBackground() {
  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Static soft ambient glow */}
      <View
        className="absolute top-[-10%] left-[10%] w-[380px] sm:w-[480px] aspect-square rounded-full"
        style={{
          ...webBlurStyle(ORB_BLUR),
          backgroundColor: "rgba(34,211,238,0.06)",
        }}
      />
      <View
        className="absolute top-[15%] right-[5%] w-[340px] sm:w-[440px] aspect-square rounded-full"
        style={{
          ...webBlurStyle(ORB_BLUR),
          backgroundColor: "rgba(167,139,250,0.05)",
        }}
      />
      <View
        className="absolute bottom-[-15%] left-[30%] w-[300px] sm:w-[380px] aspect-square rounded-full"
        style={{
          ...webBlurStyle(ORB_BLUR),
          backgroundColor: "rgba(52,211,153,0.04)",
        }}
      />
    </View>
  );
}

/**
 * Global Static Page Background.
 * Pure static ambient depth behind content with zero movement or animations.
 */
export function NeuralAnimatedBackground() {
  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: NEURAL.canvas, zIndex: 0 }}
    >
      {/* Top Ambient Glow */}
      <View
        className="absolute top-[-10%] left-[-5%] w-[500px] aspect-square rounded-full"
        style={{
          ...webBlurStyle(ORB_BLUR),
          backgroundColor: "rgba(34,211,238,0.05)",
        }}
      />

      {/* Middle-Right Ambient Glow */}
      <View
        className="absolute top-[35%] right-[-10%] w-[480px] aspect-square rounded-full"
        style={{
          ...webBlurStyle(ORB_BLUR),
          backgroundColor: "rgba(167,139,250,0.04)",
        }}
      />

      {/* Bottom Ambient Glow */}
      <View
        className="absolute bottom-[-5%] left-[10%] w-[420px] aspect-square rounded-full"
        style={{
          ...webBlurStyle(ORB_BLUR),
          backgroundColor: "rgba(52,211,153,0.04)",
        }}
      />
    </View>
  );
}
