import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { NEURAL } from "ui/theme/neuralRuntime";
import { MarqueeRow } from "./marqueeRow";

const TRUSTED_BY = [
  "Turborepo",
  "Yarn",
  "Next.js",
  "Expo",
  "TypeScript",
  "Workspaces",
] as const;

export function TrustMarqueeSection() {
  return (
    <View className="w-full" style={{ direction: "ltr" }}>
      <Text
        className="text-xs text-center mb-6 uppercase tracking-widest"
        style={{ color: NEURAL.textDim }}
      >
        Monorepo stack
      </Text>
      <View className="opacity-70">
        <MarqueeRow items={TRUSTED_BY} />
      </View>
    </View>
  );
}
